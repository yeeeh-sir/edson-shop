import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../services/api';

export default function Products() {
  const { adminProducts, removeProduct } = useAdmin();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(0);

  const perPage = 8;

  const list = useMemo(() => {
    let rows = adminProducts;
    if (category !== 'all') rows = rows.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return rows;
  }, [adminProducts, query, category]);

  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const paged = list.slice(safePage * perPage, safePage * perPage + perPage);

  const doRemove = (id) => {
    removeProduct(id);
    setConfirmId(null);
    setToast('Product deleted (demo)');
    setTimeout(() => setToast(''), 2500);
  };

  const stockBadge = (stock) =>
    stock <= 0
      ? 'bg-rose-100 text-rose-700'
      : stock <= 10
        ? 'bg-amber-100 text-amber-700'
        : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{list.length} products in the live catalogue.</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {toast && (
        <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search by name or SKU…"
            aria-label="Search products"
            className="input rounded-xl !pl-10"
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }} className="input sm:w-48" aria-label="Filter by category">
          <option value="all">All categories</option>
          <option value="electronics">Electronics</option>
          <option value="stationery">Stationery</option>
          <option value="graphics">Graphics</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-900/5">
                        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <div>
                        <p className="max-w-[220px] truncate font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-medium text-slate-600">{p.categoryName}</span>
                    <p className="text-[11px] text-slate-400">{p.subcategory}</p>
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-800">
                    {formatPrice(p.price)}
                    {p.oldPrice && <p className="text-[11px] font-normal text-slate-400 line-through">{formatPrice(p.oldPrice)}</p>}
                  </td>
                  <td className="px-5 py-3"><span className={`badge ${stockBadge(p.stock)}`}>{p.stock}</span></td>
                  <td className="px-5 py-3">{p.rating} ({p.reviews})</td>
                  <td className="px-5 py-3"><span className={`badge ${p.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>{p.status}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Link to={`/product/${p.id}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600" aria-label={`View ${p.name}`}>
                        <Eye size={16} />
                      </Link>
                      <Link to={`/admin/products/edit/${p.id}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600" aria-label={`Edit ${p.name}`}>
                        <Pencil size={16} />
                      </Link>
                      <button type="button" onClick={() => setConfirmId(p.id)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${p.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-400">
              Page {safePage + 1} of {pages}
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: pages }).slice(0, 10).map((_, i) => (
                <button key={i} type="button" onClick={() => setPage(i)} className={`h-8 w-8 rounded-lg text-xs font-bold transition ${i === safePage ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="w-full max-w-sm animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
            <h3 className="font-display text-lg font-bold text-slate-900">Delete product?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This will remove the product from the (demo) catalogue. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirmId(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="button" onClick={() => doRemove(confirmId)} className="btn-primary flex-1 !bg-rose-600 hover:!bg-rose-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}