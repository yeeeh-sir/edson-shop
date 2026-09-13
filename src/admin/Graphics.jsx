import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, Palette } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../services/api';

const serviceTypes = [
  'Banners', 'T-Shirts', 'Posters', 'Business Cards', 'Flyers', 'Logos',
  'Invitations', 'Photo Printing', 'Social Media Designs', 'Custom Designs',
];

export default function GraphicsAdmin() {
  const { updateProduct, removeProduct } = useAdmin();
  const [filter, setFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState('');

  const graphics = useAdmin().adminProducts.filter((p) => p.isService);
  const list = graphics.filter((p) => filter === 'all' || p.subcategory === filter);

  const toggleFeatured = (p) => {
    updateProduct(p.id, { featured: !p.featured });
    setToast(`${p.name} ${p.featured ? 'removed from' : 'added to'} featured`);
    setTimeout(() => setToast(''), 2500);
  };

  const doRemove = (id) => {
    removeProduct(id);
    setConfirmId(null);
    setToast('Service deleted (demo)');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Graphics Studio</h1>
          <p className="mt-1 text-sm text-slate-500">{graphics.length} design &amp; print services (demo).</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary">
          <Plus size={16} /> Add service
        </Link>
      </div>

      {toast && (
        <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{toast}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter('all')} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          All
        </button>
        {serviceTypes.map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${filter === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <Link to={`/product/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="badge absolute left-3 top-3 bg-white/90 text-brand-800 backdrop-blur">
                {p.subcategory}
              </span>
              <span className={`badge absolute right-3 top-3 ${p.featured ? 'bg-accent-500 text-white' : 'bg-white/90 text-slate-600'}`}>
                {p.featured ? 'Featured' : 'Standard'}
              </span>
            </Link>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-400">
                    From <span className="font-bold text-slate-700">{formatPrice(p.price)}</span>
                  </p>
                </div>
                <p className="text-xs text-slate-400">{p.graphics?.sizes?.slice(0, 2).join(' · ') || 'Any size'}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => toggleFeatured(p)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${p.featured ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600 hover:bg-accent-50'}`}>
                  {p.featured ? 'Unfeature' : 'Feature'}
                </button>
                <Link to={`/admin/products/edit/${p.id}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600" aria-label={`Edit ${p.name}`}>
                  <Pencil size={16} />
                </Link>
                <Link to={`/product/${p.id}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600" aria-label={`View ${p.name}`}>
                  <Eye size={16} />
                </Link>
                <button type="button" onClick={() => setConfirmId(p.id)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${p.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!list.length && (
        <div className="card flex flex-col items-center gap-3 p-12 text-center text-slate-400">
          <Palette size={34} />
          <p className="text-sm font-medium">No {filter} services yet — add one above.</p>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div className="w-full max-w-sm animate-scale-in rounded-2xl bg-white p-6 shadow-lift">
            <h3 className="font-display text-lg font-bold text-slate-900">Delete service?</h3>
            <p className="mt-2 text-sm text-slate-500">This removes the service from the demo catalogue.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirmId(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="button" onClick={() => doRemove(confirmId)} className="btn-primary flex-1 !bg-rose-600 hover:!bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}