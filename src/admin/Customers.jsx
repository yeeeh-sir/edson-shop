import React from 'react';
import { useEffect, useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { getAdminUsers } from '../services/adminApi';
import { formatPrice } from '../services/api';

const statusColor = {
  Active: 'bg-emerald-100 text-emerald-700',
  Inactive: 'bg-slate-100 text-slate-600',
  New: 'bg-sky-100 text-sky-700',
};

export default function Customers() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAdminUsers({ limit: 100 }).then((data) => setRows(data.users || [])).catch(() => setRows([]));
  }, []);

  const list = rows.filter(
    (c) =>
      !query.trim() ||
      c.full_name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">{list.length} customer accounts shown.</p>
      </div>

      <div className="relative sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          aria-label="Search customers"
          className="input !pl-10"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Orders</th>
                <th className="px-5 py-3">Total spent</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((c) => {
                const initial = c.full_name.split(' ').map((x) => x[0]).join('').slice(0, 2);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-xs font-bold text-black">{initial}</span>
                        <div>
                          <p className="font-semibold text-slate-800">{c.full_name}</p>
                          <p className="flex items-center gap-1 text-xs text-slate-400"><Mail size={11} /> {c.email}</p>
                          {c.google_id && <span className="text-[10px] font-semibold text-brand-600">Google account</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-700">{c.orders_count}</td>
                    <td className="px-5 py-3 font-bold text-slate-800">{formatPrice(Number(c.spent))}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3"><span className={`badge ${statusColor[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card flex items-center gap-3 p-5 text-sm text-slate-500">
        <Phone size={16} className="text-brand-500" />
        Customer profiles are loaded from the protected admin API.
      </div>
    </div>
  );
}