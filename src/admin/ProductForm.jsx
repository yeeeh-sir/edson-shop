import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Info } from 'lucide-react';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import { useAdmin } from '../context/AdminContext';
import { getAdminCategories, getCategory } from '../services/api';
import { uploadProductImages } from '../services/adminApi';

const FIELD = 'input';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, adminProducts } = useAdmin();
  const [saving, setSaving] = useState(false);
  const editing = Boolean(id);
  const existing = editing ? adminProducts.find((p) => String(p.id) === String(id)) : null;

  const [images, setImages] = useState([]);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '', category: '', subcategory: '', description: '',
    price: '', oldPrice: '', stock: '', sku: '', rating: 0, reviews: 0,
    featured: false, popular: false, isNew: false, isService: false, status: 'published',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || '',
        category: existing.category || existing.category_slug || '',
        subcategory: existing.subcategory || '',
        description: existing.description || '',
        price: existing.price ?? '',
        oldPrice: existing.oldPrice ?? '',
        stock: existing.stock ?? '',
        sku: existing.sku || '',
        rating: existing.rating || 0,
        reviews: existing.reviews || 0,
        featured: !!existing.featured,
        popular: !!existing.popular,
        isNew: !!existing.isNew,
        isService: !!existing.isService,
        status: existing.status || 'published',
      });
      setImages(
        (existing.images || [existing.image])
          .map((src, i) => ({ id: `existing-${i}`, src, name: src, primary: i === 0 }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const [subcats, setSubcats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    getAdminCategories()
      .then((items) => {
        setCategories(items || []);
        setForm((current) => ({
          ...current,
          category: current.category || items?.[0]?.slug || '',
        }));
      })
      .catch((error) => setCategoryError(error.message));
  }, []);

  useEffect(() => {
    if (!form.category) return;
    getCategory(form.category)
      .then((category) => setSubcats(category.subcategories || []))
      .catch(() => setSubcats([]));
  }, [form.category]);

  const onAdd = (added) =>
    setImages((prev) => [
      ...prev.map((i) => ({ ...i, primary: false })),
      ...added.map((a) => ({ ...a, primary: prev.length === 0 })),
    ]);
  const onRemove = (imgId) =>
    setImages((prev) => {
      const next = prev.filter((i) => i.id !== imgId);
      if (!next.some((i) => i.primary) && next.length) next[0].primary = true;
      return next;
    });
  const onSetPrimary = (imgId) => setImages((prev) => prev.map((i) => ({ ...i, primary: i.id === imgId })));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const main = images.find((i) => i.primary) || images[0];
    const newFiles = images.filter((image) => image.file).map((image) => image.file);
    const existingMainImage = main && !main.file ? main.src : null;
    const payload = {
      ...form,
      image: existingMainImage,
      images: [],
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
    };

    try {
      const product = editing ? await updateProduct(id, payload) : await addProduct(payload);
      if (newFiles.length) await uploadProductImages(product.id, newFiles);
      setSaved(true);
      setTimeout(() => navigate('/admin/products'), 900);
    } catch (error) {
      setSaved(false);
      window.alert(error.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600">
            <ArrowLeft size={15} /> Back to products
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            {editing ? 'Edit product' : 'Add new product'}
          </h1>
        </div>
        {saved && (
          <span className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Saved — redirecting…
          </span>
        )}
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Images */}
        <section className="card p-6">
          <h2 className="font-display text-base font-bold text-slate-900">Product images</h2>
          <p className="mb-4 mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <Info size={13} /> Uploaded and optimized through the secure backend image service.
          </p>
          <ImageUploader
            images={images}
            onAdd={onAdd}
            onRemove={onRemove}
            onSetPrimary={onSetPrimary}
            max={6}
          />
        </section>

        {/* Details */}
        <section className="card space-y-5 p-6">
          <h2 className="font-display text-base font-bold text-slate-900">Product details</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-name">Product name *</label>
              <input id="pf-name" className={FIELD} value={form.name} onChange={set('name')} required placeholder="e.g. Wireless Headphones" />
            </div>

            <div>
              <label className="label" htmlFor="pf-category">Category</label>
              <select id="pf-category" className={FIELD} value={form.category} onChange={(e) => { set('category')(e); setForm((f) => ({ ...f, subcategory: '' })); }} required>
                <option value="">Select a category</option>
                {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>
              {categoryError && <p className="mt-1 text-xs font-semibold text-rose-600">{categoryError}</p>}
            </div>

            <div>
              <label className="label" htmlFor="pf-sub">Subcategory *</label>
              <input id="pf-sub" list="subcat-list" className={FIELD} value={form.subcategory} onChange={set('subcategory')} required placeholder="e.g. Headphones" />
              <datalist id="subcat-list">
                {subcats.map((subcategory) => <option key={subcategory.id} value={subcategory.name}>{subcategory.name}</option>)}
              </datalist>
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="pf-desc">Description *</label>
              <textarea id="pf-desc" rows={3} className={FIELD} value={form.description} onChange={set('description')} required placeholder="Describe the product…" />
            </div>

            <div>
              <label className="label" htmlFor="pf-price">Price (RWF) *</label>
              <input id="pf-price" type="number" min="0" step="0.01" className={FIELD} value={form.price} onChange={set('price')} required />
            </div>
            <div>
              <label className="label" htmlFor="pf-old">Old price (RWF)</label>
              <input id="pf-old" type="number" min="0" step="0.01" className={FIELD} value={form.oldPrice} onChange={set('oldPrice')} placeholder="Optional — enables discount badge" />
            </div>
            <div>
              <label className="label" htmlFor="pf-stock">Stock *</label>
              <input id="pf-stock" type="number" min="0" className={FIELD} value={form.stock} onChange={set('stock')} required />
            </div>
            <div>
              <label className="label" htmlFor="pf-sku">SKU</label>
              <input id="pf-sku" className={FIELD} value={form.sku} onChange={set('sku')} placeholder="Auto-generated if empty" />
            </div>
            <div>
              <label className="label" htmlFor="pf-rating">Rating (0–5)</label>
              <input id="pf-rating" type="number" min="0" max="5" step="0.1" className={FIELD} value={form.rating} onChange={set('rating')} />
            </div>
            <div>
              <label className="label" htmlFor="pf-reviews">Reviews count</label>
              <input id="pf-reviews" type="number" min="0" className={FIELD} value={form.reviews} onChange={set('reviews')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'popular', label: 'Popular' },
              { key: 'isNew', label: 'New' },
              { key: 'isService', label: 'Service' },
            ].map((t) => (
              <label key={t.key} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-300">
                <input type="checkbox" checked={form[t.key]} onChange={set(t.key)} className="h-4 w-4 rounded accent-brand-600" />
                {t.label}
              </label>
            ))}
          </div>

          <div>
            <label className="label" htmlFor="pf-status">Status</label>
            <select id="pf-status" className={`${FIELD} sm:w-64`} value={form.status} onChange={set('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1 !py-3.5 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:!px-10">
            <Save size={17} />
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}
          </button>
          <Link to="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}