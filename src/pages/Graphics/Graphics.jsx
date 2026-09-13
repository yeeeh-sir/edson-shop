import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Check,
  Printer,
  Sparkles,
  Layers,
  Star,
  Palette,
  Paintbrush,
  Shirt,
  MessageCircle,
  Megaphone,
  StickyNote,
  FileText,
  PenTool,
  Smile,
} from 'lucide-react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import { api } from '../../services/api';

const FALLBACK = `${process.env.PUBLIC_URL}/images/fallback.svg`;

const features = [
  { icon: Printer, title: 'Premium printing', desc: 'Vibrant, accurate color on every print run.' },
  { icon: Sparkles, title: 'Rapid turnaround', desc: 'Most designs delivered in 24–48 hours.' },
  { icon: Check, title: 'Unlimited revisions', desc: 'We revise until you are 100% satisfied.' },
  { icon: Star, title: '4.9 average rating', desc: 'Trusted by 150+ businesses and organisations.' },
];

const allServices = [
  { name: 'Banners', icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-100', to: '/shop/graphics' },
  { name: 'T-Shirts', icon: Shirt, color: 'text-brand-700', bg: 'bg-brand-100', to: '/shop/graphics' },
  { name: 'Posters', icon: Palette, color: 'text-brand-600', bg: 'bg-brand-100', to: '/shop/graphics' },
  { name: 'Business Cards', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100', to: '/shop/graphics' },
  { name: 'Flyers', icon: StickyNote, color: 'text-rose-600', bg: 'bg-rose-100', to: '/shop/graphics' },
  { name: 'Logos', icon: PenTool, color: 'text-amber-600', bg: 'bg-amber-100', to: '/shop/graphics' },
  { name: 'Invitations', icon: Smile, color: 'text-pink-600', bg: 'bg-pink-100', to: '/shop/graphics' },
  { name: 'Social Media', icon: Camera, color: 'text-sky-600', bg: 'bg-sky-100', to: '/shop/graphics' },
  { name: 'Photo Printing', icon: Printer, color: 'text-brand-700', bg: 'bg-brand-100', to: '/shop/graphics' },
  { name: 'Custom Art', icon: Paintbrush, color: 'text-teal-600', bg: 'bg-teal-100', to: '/shop/graphics' },
];

export default function Graphics() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.fetchCategoryProducts('graphics').then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#171717] to-brand-900 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <div className="container-site relative grid items-center gap-8 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20">
              <Palette size={13} className="text-accent-300" /> Design &amp; Print Studio
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Your Vision,{' '}
              <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
                Designed &amp; Delivered
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">
              From logos to banners, T-shirts to posters — our studio crafts premium designs for brands, businesses and personal projects.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop/graphics" className="btn-accent !px-7 !py-3.5 text-base">
                Browse Services
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/graphics/request"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20"
              >
                <MessageCircle size={18} />
                Request Custom Design
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-brand-100">
              <p className="flex items-center gap-2"><Camera size={18} className="text-accent-300" /> 150+ projects delivered</p>
              <p className="flex items-center gap-2"><Layers size={18} className="text-accent-300" /> Print + digital files</p>
              <p className="flex items-center gap-2"><Star size={18} className="text-accent-300" /> 4.9 / 5 average rating</p>
            </div>
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="grid max-w-lg grid-cols-2 gap-5">
              {products.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="block overflow-hidden rounded-2xl bg-white/95 p-2.5 shadow-lift backdrop-blur transition-transform duration-300 hover:scale-105"
                  style={{ transform: `rotate(${i % 2 === 0 ? '-3' : '3'}deg)` }}
                >
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img src={p.image} alt={p.name} loading="lazy" onError={(e) => { e.currentTarget.src = FALLBACK; }} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 px-1 pb-1 text-[13px] font-bold text-slate-800">{p.subcategory}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white py-16">
        <div className="container-site">
          <SectionHeading
            title="Our Graphics Services"
            subtitle="Everything from quick digital assets to large-format print jobs."
            actionLabel="View all in shop"
            actionTo="/shop/graphics"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {allServices.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.name}
                  to={s.to}
                  className="group card flex flex-col items-center gap-3 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={22} />
                  </span>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-brand-700">{s.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="container-site py-16">
        <SectionHeading title="Popular Design Services" subtitle="Most requested designs from the past month." actionLabel="View all" actionTo="/shop/graphics" />
        <ProductGrid products={products} cols="lg" />
      </section>

      {/* Why design with us */}
      <section className="bg-slate-950 py-16 text-white">
        <div className="container-site">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Why Design With Us</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              Professional designers, fast delivery, unlimited revisions — every project.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/50">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-black">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-16">
        <div className="card overflow-hidden p-1">
          <div className="rounded-2xl bg-gradient-to-r from-[#050505] to-brand-700 p-10 text-center sm:p-14">
            <Palette size={40} className="mx-auto text-white/80" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
              Have a custom design in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-100 sm:text-base">
              Tell us your idea and our studio will bring it to life — fast, affordable and with unlimited revisions.
            </p>
            <p className="mt-4 text-sm text-brand-100">
              Prefer to email?{' '}
              <a href="mailto:edisonigiraneza@gmail.com" className="font-bold text-white underline-offset-2 transition hover:underline">
                edisonigiraneza@gmail.com
              </a>
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/graphics/request" className="btn-accent !px-7 !py-3.5 text-base">
                <MessageCircle size={18} />
                Request a design
              </Link>
              <Link to="/shop/graphics" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/20">
                <Palette size={18} />
                Browse services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}