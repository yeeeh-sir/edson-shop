import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgePercent,
  Truck,
  ShieldCheck,
  Clock,
  Headset,
  RefreshCcw,
  Tags,
  Palette,
  Camera,
} from 'lucide-react';

import CategoryCard from '../../components/CategoryCard/CategoryCard';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import api, { formatPrice } from '../../services/api';

const FALLBACK = `${process.env.PUBLIC_URL}/images/fallback.svg`;

const whyUs = [
  { icon: Truck, title: 'Fast Delivery', text: 'Same-day in the city, next-day nationwide — always on time.' },
  { icon: ShieldCheck, title: 'Secure Shopping', text: 'Safe payments and a 100% buyer-protection promise.' },
  { icon: Headset, title: '24/7 Support', text: 'Real humans ready to help before, during and after your order.' },
  { icon: RefreshCcw, title: 'Easy Returns', text: 'Changed your mind? 14-day hassle-free returns on all products.' },
  { icon: Tags, title: 'Best Prices', text: 'Fair, competitive pricing with weekly deals and bundles.' },
  { icon: Clock, title: 'Quality Assured', text: 'Every product and print job is checked for quality before dispatch.' },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [graphics, setGraphics] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.fetchProducts({ sort: 'popular' }),
      api.fetchProducts({ sort: 'newest' }),
      api.fetchProducts({ category: 'graphics', sort: 'popular' }),
    ]).then(([categoryRows, popularRows, newestRows, graphicsRows]) => {
      setCategories(categoryRows || []);
      setPopular(popularRows.slice(0, 8));
      setDeals(popularRows.filter((p) => Number(p.discount) > 0).sort((a, b) => b.discount - a.discount).slice(0, 4));
      setNewArrivals(newestRows.slice(0, 4));
      setGraphics(graphicsRows.slice(0, 4));
    }).catch(() => { });
  }, []);

  return (
    <div>
      

      {/* Categories */}
      <section className="container-site py-16">
        <SectionHeading
          title="Shop by Category"
          subtitle="Four departments, one goal — everything you need under one roof."
          actionLabel="View all products"
          actionTo="/shop"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Special offers */}
      <section className="container-site py-16">
        <SectionHeading
          title="Special Offers"
          subtitle="Limited-time deals with real savings. Grab them before they’re gone."
          actionLabel="See all deals"
          actionTo="/shop?sort=price-asc"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => {
            const DiscountIcon = BadgePercent;
            return (
              <div key={p.id} className="card group overflow-hidden">
                <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2.5 text-white">
                  <DiscountIcon size={17} />
                  <p className="text-sm font-bold">{p.discount}% OFF — limited time</p>
                </div>
                <div className="p-4">
                  <Link to={`/product/${p.id}`}>
                    <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK; }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </Link>
                  <Link to={`/product/${p.id}`} className="line-clamp-1 font-display text-sm font-semibold text-slate-900 hover:text-brand-700">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-400">{p.subcategory}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-slate-900">
                      {formatPrice(p.price)}
                    </span>
                    {p.oldPrice && <span className="text-sm text-slate-400 line-through">{formatPrice(p.oldPrice)}</span>}
                  </div>
                  <Link to={`/product/${p.id}`} className="btn-ghost btn-sm mt-3 w-full">
                    View deal
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      <section className="bg-white py-16">
        <div className="container-site">
          <SectionHeading
            title="Popular Right Now"
            subtitle="The most loved products and services across the whole store."
            actionLabel="Shop best sellers"
            actionTo="/shop?sort=rating"
          />
          <ProductGrid products={popular} />
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-site py-16">
        <SectionHeading title="New Arrivals" subtitle="Fresh drops from our latest catalogue." actionLabel="View new" actionTo="/shop?sort=newest" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <div key={p.id} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <Link to={`/product/${p.id}`}>
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK; }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="badge absolute left-3 top-3 bg-brand-600 text-white">NEW</span>
                </div>
              </Link>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase text-brand-600">{p.subcategory}</p>
                <Link to={`/product/${p.id}`} className="mt-1 line-clamp-1 font-display text-sm font-semibold text-slate-900 hover:text-brand-700">
                  {p.name}
                </Link>
                <p className="mt-1 font-display text-lg font-bold text-slate-900">{formatPrice(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Graphics promo */}
      <section className="container-site py-16">
        <div className="card overflow-hidden bg-gradient-to-br from-[#050505] via-[#171717] to-brand-600 p-1">
          <div className="rounded-2xl bg-white/95 p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                  <Palette size={14} /> Our design studio
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Banners · Logos · T-Shirts · Posters
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Professional design &amp; printing for brands, events and businesses. Live prices are shown in Rwandan francs.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Questions? Email us at{' '}
                  <a href="mailto:edisonigiraneza@gmail.com" className="font-semibold text-brand-700 underline-offset-2 transition-colors hover:text-brand-500 hover:underline">
                    edisonigiraneza@gmail.com
                  </a>
                </p>
              </div>
              <Link to="/graphics" className="btn-primary !px-6 !py-3">
                Explore Graphics Studio
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {graphics.map((g) => (
                <Link key={g.id} to={`/product/${g.id}`} className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={g.image}
                      alt={g.name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = FALLBACK; }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute left-3 top-3 flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase text-brand-800 backdrop-blur">
                      <Camera size={11} /> From {formatPrice(g.price)}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-slate-900 group-hover:text-brand-700">{g.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{g.subcategory}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="container-site">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Why Choose Edson Shop?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              Built to make shopping simple, fast and reliable for every customer.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w) => {
              const IconCmp = w.icon;
              return (
                <div key={w.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-black">
                    <IconCmp size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{w.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}