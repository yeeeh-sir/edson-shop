import React, { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, Loader2, ImagePlus } from 'lucide-react';
import { getStoreSettings, updateStoreSettings, getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage } from '../services/api';

export default function Settings() {
  const [form, setForm] = useState({
    shopName: 'Edson Shop',
    tagline: 'Everything You Need, In One Shop',
    currency: 'RWF',
    deliveryFee: '5000',
    freeDeliveryThreshold: '100000',
    email: 'edisonigiraneza@gmail.com',
    phone: '+250 795 031 113',
    address: 'Rubavu District, Rwanda',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [banners, setBanners] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [bannerBusy, setBannerBusy] = useState(null);
  const [bannerError, setBannerError] = useState('');
  const bannerInputs = useRef({});

  useEffect(() => {
    getStoreSettings().then((settings) => setForm((current) => ({ ...current, ...settings }))).catch((err) => setError(err.message)).finally(() => setLoading(false));
    getBanners().then(setBanners).catch((err) => setBannerError(err.message));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    setError('');
    updateStoreSettings(form).then((settings) => {
      setForm((current) => ({ ...current, ...settings }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }).catch((err) => setError(err.message));
  };

  const addBanner = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setBannerError('');
    createBanner({ title: newTitle.trim() }).then((banner) => {
      setBanners((prev) => [...prev, banner]);
      setNewTitle('');
      setBannerBusy(null);
    }).catch((err) => setBannerError(err.message));
  };

  const pickImage = (id) => bannerInputs.current[id]?.click();

  const onImageSelected = async (banner, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBannerBusy(banner.id);
    setBannerError('');
    try {
      const updated = await uploadBannerImage(banner.id, file);
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerBusy(null);
      event.target.value = '';
    }
  };

  const toggleBanner = (banner) => {
    updateBanner(banner.id, { is_active: banner.is_active ? false : true })
      .then((updated) => setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b))))
      .catch((err) => setBannerError(err.message));
  };

  const removeBanner = (banner) => {
    if (!window.confirm('Delete this banner?')) return;
    deleteBanner(banner.id).then(() => setBanners((prev) => prev.filter((b) => b.id !== banner.id))).catch((err) => setBannerError(err.message));
  };

  const Field = ({ id, label, ...rest }) => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" value={rest.value} onChange={rest.onChange} placeholder={rest.placeholder || ''} />
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Store settings</h1>
        <p className="mt-1 text-sm text-slate-500">General shop configuration saved to the database.</p>
      </div>

      {loading && <p className="rounded-xl bg-white p-4 text-sm font-semibold text-slate-500">Loading saved settings...</p>}
      {(error || bannerError) && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error || bannerError}</p>}

      {saved && (
        <div className="animate-fade-in rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Settings saved. Storefront values will update on the next page load.
        </div>
      )}

      <form onSubmit={save} className="card space-y-5 p-6 sm:p-8">
        <h2 className="font-display text-base font-bold text-slate-900">Store identity</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="s-name" label="Shop name" value={form.shopName} onChange={set('shopName')} />
          <Field id="s-tagline" label="Tagline" value={form.tagline} onChange={set('tagline')} />
          <div>
            <label className="label" htmlFor="s-currency">Currency</label>
            <select id="s-currency" className="input" value={form.currency} onChange={set('currency')}>
              <option>RWF</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="s-delivery">Delivery fee (RWF)</label>
            <input id="s-delivery" type="number" min="0" className="input" value={form.deliveryFee} onChange={set('deliveryFee')} />
          </div>
          <div>
            <label className="label" htmlFor="s-threshold">Free delivery threshold (RWF)</label>
            <input id="s-threshold" type="number" min="0" className="input" value={form.freeDeliveryThreshold} onChange={set('freeDeliveryThreshold')} />
          </div>
        </div>

        <h2 className="border-t border-slate-100 pt-5 font-display text-base font-bold text-slate-900">Contact details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="s-email" label="Store email" value={form.email} onChange={set('email')} />
          <Field id="s-phone" label="Phone" value={form.phone} onChange={set('phone')} />
          <div className="sm:col-span-2">
            <Field id="s-address" label="Address" value={form.address} onChange={set('address')} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          <Save size={16} /> Save settings
        </button>
      </form>

      <section className="card space-y-5 p-6 sm:p-8">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">Banners</h2>
          <p className="mt-1 text-sm text-slate-500">Promotional images shown on the homepage. Images are uploaded securely via the backend.</p>
        </div>

        <form onSubmit={addBanner} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Banner title…"
            aria-label="New banner title"
            className="input flex-1"
          />
          <button type="submit" disabled={bannerBusy != null} className="btn-primary disabled:opacity-60">
            <Plus size={16} /> Add banner
          </button>
        </form>

        {banners.length === 0 && !loading && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No banners yet. Add one, then upload an image.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {banners.map((banner) => (
            <div key={banner.id} className={`overflow-hidden rounded-xl border border-slate-200 ${banner.is_active ? '' : 'opacity-60'}`}>
              <div className="relative aspect-[16/6] overflow-hidden bg-slate-100">
                {banner.image_url && <img src={banner.image_url} alt={banner.title || 'Banner'} className="h-full w-full object-cover" />}
                {bannerBusy === banner.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70"><Loader2 size={22} className="animate-spin text-brand-600" /></div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{banner.title || `Banner #${banner.id}`}</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBanner(banner)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${banner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {banner.is_active ? '● Active' : '○ Hidden'}
                    </button>
                    <button type="button" onClick={() => removeBanner(banner)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Delete banner">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    ref={(el) => { bannerInputs.current[banner.id] = el; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => onImageSelected(banner, e)}
                  />
                  <button type="button" onClick={() => pickImage(banner.id)} disabled={bannerBusy != null} className="btn-ghost !w-full !py-2 text-sm disabled:opacity-60">
                    <ImagePlus size={15} className={banner.image_url ? 'text-brand-500' : ''} />
                    {banner.image_url ? 'Replace banner image' : 'Upload banner image'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}