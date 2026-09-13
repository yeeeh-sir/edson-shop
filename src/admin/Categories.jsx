import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Download, Home, Tag, ImagePlus, Loader2 } from 'lucide-react';
import Icon from '../components/IconSet';
import { addCategory, deleteCategory, getAdminCategories, updateCategoryStatus, uploadCategoryImage } from '../services/api';

export default function Categories() {
  const [list, setList] = useState([]);
  const [newName, setNewName] = useState('');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(null);
  const fileInputs = useRef({});

  useEffect(() => {
    getAdminCategories().then(setList).catch((error) => showToast(error.message));
  }, []);

  const toggle = (category) => {
    const status = category.status === 'active' ? 'inactive' : 'active';
    updateCategoryStatus(category.id, status).then((updated) => {
      setList((prev) => prev.map((item) => (item.id === category.id ? updated : item)));
    }).catch((error) => showToast(error.message));
  };

  const add = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({ name: newName.trim(), slug, description: 'New category' }).then((category) => {
      setList((prev) => [...prev, category]);
      setNewName('');
      showToast(`Category "${category.name}" added`);
    }).catch((error) => showToast(error.message));
  };

  const remove = (id) => {
    deleteCategory(id).then(() => {
      setList((prev) => prev.filter((c) => c.id !== id));
      showToast('Category removed');
    }).catch((error) => showToast(error.message));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const onImageSelected = async (category, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(category.id);
    setToast('');
    try {
      const updated = await uploadCategoryImage(category.id, file);
      setList((prev) => prev.map((item) => (item.id === category.id ? updated : item)));
      showToast(`Image updated for "${category.name}"`);
    } catch (error) {
      showToast(error.message);
    } finally {
      setBusy(null);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the shop’s main departments.</p>
      </div>

      {toast && (
        <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{toast}</div>
      )}

      <form onSubmit={add} className="card flex flex-col gap-3 p-5 sm:flex-row">
        <div className="relative flex-1">
          <Tag size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name…"
            aria-label="New category name"
            className="input !pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Add category
        </button>
      </form>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          return (
            <div key={c.slug} className={`card overflow-hidden transition-all ${c.active ? '' : 'opacity-60'}`}>
              <div className="relative h-28">
                {c.image && <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <span className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-brand-600">
                  <Icon name={c.icon} size={18} />
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-slate-900">{c.name}</h3>
                  <span className="text-xs font-bold text-slate-400">{c.product_count || 0} prods</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{c.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {c.status === 'active' ? '● Active' : '○ Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputs.current[c.id]?.click()}
                    disabled={busy != null}
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-60"
                  >
                    {busy === c.id ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />} {c.image ? 'Replace' : 'Upload'}
                  </button>
                  <input
                    ref={(el) => { fileInputs.current[c.id] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => onImageSelected(c, e)}
                  />
                  <button type="button" onClick={() => remove(c.id)} className="ml-auto rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${c.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <Link className="card flex flex-col items-center justify-center gap-2 border-2 border-dashed !ring-0 p-8 text-slate-400 transition hover:border-brand-400 hover:text-brand-500" to="/admin/products/add">
          <Home size={26} />
          <span className="text-sm font-semibold">Add products to a category</span>
        </Link>
      </div>

      <div className="card flex items-center gap-3 p-5 text-sm text-slate-500">
        <Download size={16} className="text-brand-500" />
        Category records are managed directly in the database.
      </div>
    </div>
  );
}