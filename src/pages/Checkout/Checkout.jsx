import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ImagePlus,
  X,
  UploadCloud,
  AlertCircle,
} from 'lucide-react';
import CartSummary from '../../components/CartSummary/CartSummary';
import EmptyState from '../../components/EmptyState/EmptyState';
import Modal from '../../components/Modal/Modal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../services/api';
import { submitPayment } from '../../services/api';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'France', 'Germany', 'Other'];

const emptyForm = {
  fullName: '', phone: '', email: '', address: '', city: '', country: 'Rwanda', notes: '',
};

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;
const SCREENSHOT_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function Checkout() {
  const { items, subtotal, delivery, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionReference, setTransactionReference] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [screenshotError, setScreenshotError] = useState('');

  React.useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      fullName: user.full_name || current.fullName,
      email: user.email || current.email,
      phone: user.phone || current.phone,
      address: user.address || current.address,
      city: user.city || current.city,
      country: user.country || current.country,
    }));
  }, [user]);

  React.useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleScreenshotChange = (file) => {
    setScreenshotError('');
    if (!file) {
      setScreenshot(null);
      setScreenshotPreview('');
      return;
    }
    if (!SCREENSHOT_TYPES.includes(file.type)) {
      setScreenshotError('Only JPG, PNG or WEBP images are allowed.');
      setScreenshot(null);
      setScreenshotPreview('');
      return;
    }
    if (file.size > MAX_SCREENSHOT_SIZE) {
      setScreenshotError('Screenshot is too large. Maximum size is 5MB.');
      setScreenshot(null);
      setScreenshotPreview('');
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      setError('Please fill in your full name, phone, address and city.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!screenshot) {
      setError('Please upload your payment screenshot.');
      return;
    }
    if (!screenshotPreview) {
      setError('Upload is still processing. Please wait a moment and try again.');
      return;
    }
    setPlacing(true);
    try {
      const payment = await submitPayment({
        customer: { full_name: form.fullName, phone: form.phone, email: form.email, address: form.address, city: form.city, country: form.country, notes: form.notes },
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
        payment_method: 'mobile_money',
        payment_number: paymentNumber,
        transaction_reference: transactionReference,
        customer_note: form.notes,
        screenshot,
      });
      setSuccess({ orderId: payment.order_number, total: payment.amount });
      clear();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="container-site py-12">
        <div className="mx-auto max-w-lg">
          <EmptyState
            title="Nothing to check out"
            message="Add a few items to your cart first, then come back here to place your order."
            icon="ShoppingCart"
            action={
              <Link to="/shop" className="btn-primary">Go to shop</Link>
            }
          />
        </div>
      </div>
    );
  }

  const inputCls = 'input';

  return (
    <div className="container-site py-12">
      <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
        <Link to="/cart" className="hover:text-brand-600">Home / Cart</Link> <span className="mx-1">/</span>
        <span className="font-semibold text-slate-700">Checkout</span>
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Checkout</h1>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Customer info */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-slate-900">1 · Customer Information</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullName">Full name *</label>
                <input id="fullName" className={inputCls} value={form.fullName} onChange={set('fullName')} placeholder="Jane Cooper" required />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone *</label>
                <input id="phone" className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" required />
              </div>
              <div>
                <label className="label" htmlFor="email">Email *</label>
                <input id="email" type="email" className={`${inputCls} bg-slate-50`} value={form.email} readOnly required />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Address *</label>
                <input id="address" className={inputCls} value={form.address} onChange={set('address')} placeholder="123 Main Street" required />
              </div>
              <div>
                <label className="label" htmlFor="city">City *</label>
                <input id="city" className={inputCls} value={form.city} onChange={set('city')} placeholder="New York" required />
              </div>
              <div>
                <label className="label" htmlFor="country">Country *</label>
                <select id="country" className={inputCls} value={form.country} onChange={set('country')}>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" rows={3} className={inputCls} value={form.notes} onChange={set('notes')} placeholder="Delivery instructions, design details…" />
              </div>
            </div>
          </section>

          {/* Payment verification */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-slate-900">2 · Payment Required</h2>
            <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-900">
              <p className="font-bold">Send exactly {formatPrice(total)} using Mobile Money</p>
              <p className="mt-2">Payment number: <strong>+250 795 031 113</strong></p>
              <p>Name: <strong>Edison Igiraneza</strong></p>
              <p className="mt-3 text-xs">Complete payment first, then upload your screenshot and submit the confirmation. Payment is manually verified by an administrator.</p>
            </div>
            <div className="mt-5 space-y-4">
              <div><label className="label" htmlFor="paymentNumber">Number used for payment</label><input id="paymentNumber" className={inputCls} value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)} placeholder="+250 ..." required /></div>
              <div><label className="label" htmlFor="transactionReference">Transaction reference (optional)</label><input id="transactionReference" className={inputCls} value={transactionReference} onChange={(e) => setTransactionReference(e.target.value)} /></div>
              <div>
                <label className="label" htmlFor="paymentScreenshot">Payment screenshot *</label>
                {screenshot === null ? (
                  <label
                    htmlFor="paymentScreenshot"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 px-5 py-7 text-center transition hover:border-brand-500 hover:bg-brand-50"
                  >
                    <UploadCloud size={26} className="text-brand-600" />
                    <input
                      id="paymentScreenshot"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => handleScreenshotChange(e.target.files?.[0] || null)}
                      disabled={placing}
                    />
                    <span className="text-sm font-semibold text-brand-700">Click to upload your screenshot</span>
                    <span className="text-xs text-slate-400">JPG, PNG or WEBP · max 5MB</span>
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="relative bg-slate-100">
                      <img src={screenshotPreview} alt="Payment screenshot preview" className="max-h-64 w-full bg-slate-100 object-contain" />
                      <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">Selected</span>
                      <button
                        type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(''); }}
                        disabled={placing}
                        className="absolute right-3 top-3 rounded-full bg-slate-900/70 p-1.5 text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Remove screenshot"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <ImagePlus size={16} className="shrink-0 text-brand-600" />
                        <span className="truncate text-sm font-medium text-slate-700">{screenshot.name}</span>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">
                        {(screenshot.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}
                {screenshotError && (
                  <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-600">
                    <AlertCircle size={14} /> {screenshotError}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-400">Never upload PINs, passwords, or OTPs.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="space-y-5">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-slate-900">Order Summary</h2>
            <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img src={i.image} alt={i.name} loading="lazy" className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-800">{i.name}</p>
                    <p className="text-xs text-slate-400">Qty {i.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
              <CartSummary subtotal={subtotal} delivery={delivery} total={total} showDeliveryNote={false} />
            </div>
          </div>

          <div className="card p-6 text-sm text-slate-500">
            <p className="flex items-center gap-2.5"><ShieldCheck size={17} className="text-emerald-600" /> Buyer protection on every order</p>
            <p className="mt-2 text-xs">
              Your payment remains pending until an administrator verifies it.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={placing || !screenshot} className="btn-primary !w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-50">
            {placing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {placing ? 'Placing order…' : `Place Order · ${formatPrice(total)}`}
          </button>
          <Link to="/cart" className="btn-ghost !w-full">
            <ArrowLeft size={15} />
            Back to cart
          </Link>
        </aside>
      </form>

      {/* Success modal */}
      <Modal open={!!success} onClose={() => navigate('/shop')} title="Order placed">
        {success && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>
            <h4 className="mt-4 font-display text-xl font-bold text-slate-900">Thank you for your order!</h4>
            <p className="mt-2 text-sm text-slate-500">
              Your order <span className="font-bold text-slate-800">{success.orderId}</span> of{' '}
              <span className="font-bold text-slate-800">{formatPrice(success.total)}</span> has been received.
              Your payment confirmation is pending manual verification.
            </p>
            <button type="button" onClick={() => navigate('/shop')} className="btn-primary mt-6 !w-full">
              Continue Shopping
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}