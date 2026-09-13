import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Palette, CheckCircle2, Loader2, ImagePlus } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import Modal from '../../components/Modal/Modal';
import api, { formatPrice } from '../../services/api';

const emptyForm = {
  fullName: '', phone: '', email: '',
  designType: 'Logo Design', size: 'Standard', quantity: '1', description: '',
};

export default function CustomDesign() {
  const [params] = useSearchParams();
  const serviceParam = params.get('service');
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.fetchCategoryProducts('graphics').then(setServices).catch(() => setServices([]));
  }, []);

  const defaultType =
    serviceParam && services.some((s) => s.name === serviceParam)
      ? serviceParam
      : services[0]?.name || '';

  const [form, setForm] = useState({ ...emptyForm, designType: defaultType });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onAdd = (added) => {
    setImages((prev) => [
      ...prev.map((i) => ({ ...i, primary: false })),
      ...added.map((a) => ({ ...a, primary: prev.length === 0 })),
    ]);
  };
  const onRemove = (id) =>
    setImages((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (!next.some((i) => i.primary) && next.length) next[0].primary = true;
      return next;
    });
  const onSetPrimary = (id) =>
    setImages((prev) => prev.map((i) => ({ ...i, primary: i.id === id })));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.phone.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter your full name, phone and a valid email address.');
      return;
    }
    setSubmitting(true);
    const res = await api.requestDesign({ ...form, images: images.map((i) => i.name) });
    setSubmitting(false);
    if (res.success) {
      setSuccess({ requestId: res.requestId });
      setForm(emptyForm);
      setImages([]);
    }
  };

  return (
    <div className="container-site py-12">
      <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
        <Link to="/graphics" className="hover:text-brand-600">Graphics</Link> <span className="mx-1">/</span>
        <span className="font-semibold text-slate-700">Request Custom Design</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold text-brand-800">
            <Palette size={13} /> Design Studio
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">Request Custom Design</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
            Tell us about your project and upload a reference. Our studio will reply with a quote and timeline.
          </p>
        </div>

        <form onSubmit={submit} className="card mt-10 space-y-6 p-6 sm:p-10">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600" role="alert">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">Full name *</label>
              <input id="fullName" className="input" value={form.fullName} onChange={set('fullName')} placeholder="Jane Cooper" required />
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone *</label>
              <input id="phone" className="input" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="label">Email *</label>
              <input id="email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="jane@example.com" required />
            </div>

            <div>
              <label htmlFor="designType" className="label">Design type *</label>
              <select id="designType" className="input" value={form.designType} onChange={set('designType')}>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.subcategory} — from {formatPrice(s.price)}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="label">Size</label>
                <select id="size" className="input" value={form.size} onChange={set('size')}>
                  {['Small', 'Standard', 'Large', 'Custom'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="label">Quantity</label>
                <select id="quantity" className="input" value={form.quantity} onChange={set('quantity')}>
                  {['1', '2', '5', '10', '25', '50', '100+'].map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label">Project description</label>
            <textarea
              id="description"
              rows={4}
              className="input"
              value={form.description}
              onChange={set('description')}
              placeholder="Describe your idea, style, colors, deadline, and anything else we should know…"
            />
          </div>

          <div>
            <p className="label flex items-center gap-1.5">
              <ImagePlus size={15} className="text-slate-400" /> Reference images
            </p>
            <ImageUploader
              images={images}
              onAdd={onAdd}
              onRemove={onRemove}
              onSetPrimary={onSetPrimary}
              max={3}
              hint="Attach up to 3 reference images so we can match your style. Preview appears after selecting."
            />
          </div>

          <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Frontend only — your request is not sent anywhere yet. It will connect to the future Node.js + Express + MySQL backend.
          </p>

          <button type="submit" disabled={submitting} className="btn-primary !w-full !py-4 text-base">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Palette size={18} />}
            {submitting ? 'Submitting request…' : 'Submit Design Request'}
          </button>
        </form>
      </div>

      <Modal
        open={!!success}
        onClose={() => setSuccess(null)}
        title="Design request received"
      >
        {success && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>
            <h4 className="mt-4 font-display text-xl font-bold text-slate-900">Thanks — we’re on it!</h4>
            <p className="mt-2 text-sm text-slate-500">
              Your request <span className="font-bold text-slate-800">{success.requestId}</span> has been received.
              Our design team will contact you within 24 hours with a quote.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setSuccess(null)} className="btn-ghost flex-1">Submit another</button>
              <Link to="/graphics" className="btn-primary flex-1">Back to Graphics</Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}