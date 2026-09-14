import React, { useEffect, useState } from 'react';
import { Eye, Search, Maximize2, ImageOff, X, Trash2 } from 'lucide-react';
import { getAdminPayments, approvePayment, rejectPayment, deletePayment } from '../services/api';
import { formatPrice } from '../services/api';
import { cloudinaryVariant } from '../utils/cloudinary';

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'processing', 'shipped', 'delivered'];

const thumbnail = (url) => cloudinaryVariant(url, 96);
const fullImage = (url) => cloudinaryVariant(url, 1600);

export default function Orders() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    getAdminPayments({ limit: 100 })
      .then((data) => setRows(data.payments || []))
      .catch((err) => setError(err.message));
  }, []);

  const review = async (payment, approved) => {
    const note = window.prompt(approved ? 'Optional approval note' : 'Reason for rejection (required)') || '';
    if (!approved && !note.trim()) return;
    try {
      const updated = approved ? await approvePayment(payment.id, note) : await rejectPayment(payment.id, note);
      setRows((prev) => prev.map((item) => item.id === payment.id ? { ...item, ...updated } : item));
    } catch (reviewError) { setError(reviewError.message); }
  };

  const remove = async (payment) => {
    if (!window.confirm(`Delete payment history for ${payment.order_number}?\nThis permanently removes the record and its screenshot.`)) return;
    try {
      await deletePayment(payment.id);
      setRows((prev) => prev.filter((item) => item.id !== payment.id));
      if (viewing && viewing.id === payment.id) setViewing(null);
    } catch (deleteError) { setError(deleteError.message); }
  };

  const list = rows.filter(
    (o) =>
      (statusFilter === 'all' || o.status === statusFilter || o.order_status === statusFilter) &&
      (!query.trim() || o.order_number.toLowerCase().includes(query.toLowerCase()) || (o.full_name || '').toLowerCase().includes(query.toLowerCase()) || (o.email || '').toLowerCase().includes(query.toLowerCase()) || (o.phone || '').includes(query) || (o.transaction_reference || '').toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">{list.length} orders shown out of {rows.length}.</p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer…"
            aria-label="Search orders"
            className="input !pl-10"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-44" aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All payments' : s}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Screenshot</th>
                <th className="px-5 py-3">Review</th>
                <th className="px-5 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3 font-bold text-slate-800">{o.order_number}</td>
                  <td className="px-5 py-3 text-slate-600"><p>{o.full_name || 'Guest'}</p><p className="text-xs text-slate-400">{o.email}</p><p className="text-xs text-slate-400">{o.phone}</p></td>
                  <td className="px-5 py-3 text-slate-600">{o.products}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-bold text-slate-800">{formatPrice(Number(o.amount))}</td>
                  <td className="px-5 py-3 text-slate-500"><span className={`badge ${o.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : o.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span><p className="mt-1 text-xs">{o.transaction_reference || 'No reference'}</p></td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setViewing(o)}
                      className="group relative block h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      aria-label={`View screenshot for ${o.order_number}`}
                      title="View screenshot"
                    >
                      {o.screenshot_url ? (
                        <img
                          src={thumbnail(o.screenshot_url)}
                          alt={`Payment screenshot for ${o.order_number}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : null}
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/40 group-hover:opacity-100">
                        <Maximize2 size={16} className="text-white" />
                      </span>
                      {!o.screenshot_url && (
                        <span className="absolute inset-0 flex items-center justify-center text-slate-300">
                          <ImageOff size={20} />
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    {o.status === 'pending' && <div className="flex gap-2"><button type="button" onClick={() => review(o, true)} className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-bold text-white">Approve</button><button type="button" onClick={() => review(o, false)} className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-bold text-white">Reject</button></div>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button type="button" onClick={() => setViewing(o)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600" aria-label={`View ${o.order_number}`}>
                      <Eye size={16} />
                    </button>
                    <button type="button" onClick={() => remove(o)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete payment ${o.order_number}`} title="Delete payment history">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Order details" onClick={() => setViewing(null)}>
          <div className="max-h-[90vh] w-full max-w-lg animate-scale-in overflow-y-auto rounded-2xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-slate-900">Payment for {viewing.order_number}</h3>
              <button type="button" onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {viewing.screenshot_url ? (
              <button type="button" className="mt-4 block w-full" onClick={() => window.open(viewing.screenshot_url, '_blank', 'noopener,noreferrer')} title="Open full screenshot in new tab">
                <img
                  src={fullImage(viewing.screenshot_url)}
                  alt="Payment screenshot"
                  className="max-h-[50vh] w-full rounded-xl bg-slate-100 object-contain"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  <Maximize2 size={13} /> Open full screenshot
                </span>
              </button>
            ) : (
              <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
                <span className="flex items-center gap-2"><ImageOff size={18} /> Screenshot unavailable</span>
              </div>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[['Customer', viewing.full_name], ['Email', viewing.email], ['Phone', viewing.phone], ['Product', viewing.products], ['Date', new Date(viewing.created_at).toLocaleDateString()], ['Amount', formatPrice(Number(viewing.amount))], ['Payment', viewing.status], ['Reference', viewing.transaction_reference || 'None']].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-400">{k}</dt>
                  <dd className="font-semibold text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            {viewing.admin_note && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Admin note: {viewing.admin_note}</p>}
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => remove(viewing)} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
                <Trash2 size={15} /> Delete
              </button>
              <button type="button" onClick={() => setViewing(null)} className="btn-primary flex-1 !m-0">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}