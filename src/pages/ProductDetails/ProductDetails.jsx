import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Palette,
  LayoutTemplate,
  Ruler,
  Layers,
  FileText,
  Settings2,
} from 'lucide-react';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import Rating from '../../components/Rating/Rating';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import api from '../../services/api';
import { formatPrice } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { id: 'description', label: 'Description', icon: FileText },
  { id: 'specs', label: 'Specifications', icon: Settings2 },
  { id: 'delivery', label: 'Delivery & Returns', icon: Truck },
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useFavorites();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [used, setUsed] = useState(false);
  const [selected, setSelected] = useState({ size: '', material: '', printing: '' });

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.fetchProduct(id).then((p) => {
      if (!alive) return;
      setProduct(p);
      setUsed(false);
      setQty(1);
      setTab('description');
      if (p && p.isService && p.graphics) {
        setSelected({
          size: p.graphics?.sizes?.[0] || '',
          material: p.graphics?.materials?.[0] || '',
          printing: p.graphics?.printingOptions?.[0] || '',
        });
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  const isFav = product && has(product.id);

  if (loading) return <LoadingSpinner label="Loading product…" />;

  if (!product) {
    return (
      <div className="container-site py-16">
        <EmptyState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          action={<Link to="/shop" className="btn-primary">Back to shop</Link>}
        />
      </div>
    );
  }

  const p = product;

  const handleAdd = () => {
    addItem({ ...p, selected }, qty);
  };

  const handleBuy = () => {
    if (!user) {
      addItem({ ...p, selected }, qty);
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    addItem({ ...p, selected }, qty);
    navigate('/checkout');
  };

  const serviceDetails = p.isService && (
    <div className="card mt-6 space-y-5 p-5">
      <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
        <Palette size={18} className="text-brand-600" /> Design your order
      </h3>
      <div>
        <p className="label flex items-center gap-1.5"><Palette size={14} className="text-slate-400" /> Design type</p>
        <span className="inline-block rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700">
          {p.subcategory}
        </span>
      </div>
      <div>
        <p className="label flex items-center gap-1.5"><Ruler size={14} className="text-slate-400" /> Size</p>
        <div className="flex flex-wrap gap-2">
          {p.graphics?.sizes?.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setSelected((s) => ({ ...s, size: v }))}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${selected.size === v
                ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label flex items-center gap-1.5"><Layers size={14} className="text-slate-400" /> Material</p>
        <div className="flex flex-wrap gap-2">
          {p.graphics?.materials?.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setSelected((s) => ({ ...s, material: v }))}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${selected.material === v
                ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label flex items-center gap-1.5"><LayoutTemplate size={14} className="text-slate-400" /> Printing option</p>
        <div className="flex flex-wrap gap-2">
          {p.graphics?.printingOptions?.map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setSelected((s) => ({ ...s, printing: v }))}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${selected.printing === v
                ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={used}
          onChange={(e) => setUsed(e.target.checked)}
          className="h-4 w-4 rounded accent-brand-600"
        />
        Add customization notes (describe your idea at checkout)
      </label>
    </div>
  );

  return (
    <div>
      <div className="container-site pt-6">
        <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
          Home <span className="mx-1">/</span>
          <Link to="/shop" className="hover:text-brand-600">{p.categoryName}</Link> <span className="mx-1">/</span>
          <Link to={`/shop/${p.category}`} className="hover:text-brand-600">{p.subcategory}</Link> <span className="mx-1">/</span>
          <span className="font-semibold text-slate-700">{p.name}</span>
        </nav>
      </div>

      <div className="container-site grid gap-10 py-8 lg:grid-cols-2">
        <ImageGallery images={p.images} name={p.name} />

        <div>
          <span className="badge bg-brand-100 text-brand-800">{p.categoryName}</span>
          {p.isService && <span className="badge ml-2 bg-brand-100 text-brand-700">Design service</span>}
          {p.discount > 0 && <span className="badge ml-2 bg-rose-100 text-rose-600">Save {p.discount}%</span>}

          <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating rating={p.rating} reviews={p.reviews} />
            <span className={`text-xs font-semibold ${p.stock > 10 ? 'text-emerald-600' : p.stock > 0 ? 'text-accent-600' : 'text-rose-500'}`}>
              {p.stock > 10 ? 'In stock' : p.stock > 0 ? `Only ${p.stock} left` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-brand-700">{formatPrice(p.price)}</span>
            {p.oldPrice && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatPrice(p.oldPrice)}</span>
                <span className="badge bg-rose-500 text-white">-{p.discount}% OFF</span>
              </>
            )}
            {p.isService && <span className="text-sm text-slate-400">(starting price)</span>}
          </div>

          <p className="mt-5 leading-relaxed text-slate-600">{p.description}</p>

          {serviceDetails}

          {/* Quantity */}
          {!p.isService && (
            <div className="mt-6 flex items-center gap-3">
              <span className="label !mb-0">Quantity</span>
              <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Increase quantity" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!p.isService && p.stock <= 0}
              className="btn-primary flex-1 !px-6 !py-3.5 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              <ShoppingCart size={18} />
              {p.isService ? 'Add Service' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={handleBuy}
              disabled={!p.isService && p.stock <= 0}
              className="btn-accent flex-1 !px-6 !py-3.5 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              <Zap size={18} />
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => toggle(p.id)}
              aria-pressed={isFav}
              className={`rounded-xl border px-4 py-3.5 transition-all duration-300 ${isFav
                ? 'border-rose-200 bg-rose-50 text-rose-500'
                : 'border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500'
                }`}
            >
              <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          {p.isService && (
            <Link to={`/graphics/request?service=${encodeURIComponent(p.name)}`} className="btn-dark mt-3 !w-full">
              <Palette size={17} />
              Request Custom Design
            </Link>
          )}

          {/* Meta */}
          <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm sm:grid-cols-2">
            <p className="text-slate-500">SKU: <span className="font-semibold text-slate-800">{p.sku}</span></p>
            <p className="text-slate-500">Category: <span className="font-semibold text-slate-800">{p.subcategory}</span></p>
            <p className="flex items-center gap-1.5 text-slate-500"><Truck size={15} className="text-brand-600" /> Free delivery over RWF 100,000</p>
            <p className="flex items-center gap-1.5 text-slate-500"><ShieldCheck size={15} className="text-brand-600" /> 14-day return policy</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-site pb-16">
        <div className="card">
          <div className="flex overflow-x-auto border-b border-slate-100 scrollbar-none" role="tablist" aria-label="Product information">
            {TABS.map((t) => {
              const IconCmp = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold transition-colors ${tab === t.id
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <IconCmp size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8">
            {tab === 'description' && (
              <div className="max-w-3xl space-y-4 text-slate-600">
                <p>{p.description}</p>
                <p>
                  Every {p.isService ? 'design order' : 'product'} sold by Edison Shop is checked for quality before it reaches you.
                  Our {p.categoryName} range is selected for durability, value and great design.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  <li>Authentic products — no fakes, ever.</li>
                  <li>Secure payment and instant order confirmation.</li>
                  <li>Responsive 24/7 support by real humans.</li>
                </ul>
              </div>
            )}
            {tab === 'specs' && (
              <div className="max-w-3xl">
                <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-100 sm:grid-cols-2">
                  {[
                    ['Category', p.categoryName],
                    ['Subcategory', p.subcategory],
                    ['SKU', p.sku],
                    ['Stock', p.stock > 0 ? `${p.stock} units` : 'Out of stock'],
                    ['Rating', `${p.rating} / 5 (${p.reviews} reviews)`],
                    ['Condition', 'Brand new'],
                    ['Warranty', '12-month official'],
                    ['Made for', p.isService ? 'Your project' : 'Everyday use'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-slate-50 px-4 py-3 text-sm last:border-0 sm:even:border-l">
                      <span className="text-slate-400">{k}</span>
                      <span className="text-right font-semibold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'delivery' && (
              <div className="grid max-w-3xl grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <Truck size={20} className="text-brand-600" />
                  <p className="mt-2 font-semibold text-slate-800">Fast delivery</p>
                  <p className="mt-1 text-xs">Same-day in the city, 1–3 days nationwide. Free over RWF 100,000.</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <RotateCcw size={20} className="text-brand-600" />
                  <p className="mt-2 font-semibold text-slate-800">Easy returns</p>
                  <p className="mt-1 text-xs">14-day hassle-free returns on unopened products.</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <ShieldCheck size={20} className="text-brand-600" />
                  <p className="mt-2 font-semibold text-slate-800">Safe payment</p>
                  <p className="mt-1 text-xs">Card, mobile money and bank transfer — all protected.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Related productsP={p} />
    </div>
  );
}

function Related({ productsP }) {
  const [related, setRelated] = useState([]);
  useEffect(() => {
    let alive = true;
    api.fetchRelated(productsP).then((r) => alive && setRelated(r));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsP.id]);

  if (!related.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="container-site">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900">You may also like</h2>
          <Link to={`/shop/${productsP.category}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View more →
          </Link>
        </div>
        <ProductGrid products={related} cols="lg" />
      </div>
    </section>
  );
}