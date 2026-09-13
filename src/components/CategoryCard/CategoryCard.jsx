import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Icon from '../IconSet';

const CATEGORY_BACKGROUNDS = {
  electronics:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=70&fm=webp',
  stationery:
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=70&fm=webp',
  graphics:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=70&fm=webp',
  others:
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=70&fm=webp',
};

const CATEGORY_FALLBACK = {
  electronics: '#1e293b',
  stationery: '#3b2f1f',
  graphics: '#2e1065',
  others: '#134e4a',
};

export default function CategoryCard({ category }) {
  const iconBg = {
    brand: 'bg-brand-100 text-brand-700',
    accent: 'bg-accent-100 text-accent-700',
    violet: 'bg-brand-100 text-brand-800',
    teal: 'bg-teal-100 text-teal-700',
  };

  const backgroundUrl = CATEGORY_BACKGROUNDS[category.slug] || category.image || '';
  const fallbackColor = CATEGORY_FALLBACK[category.slug] || '#1e293b';
  const bgImage = backgroundUrl
    ? `linear-gradient(to bottom, rgba(2,6,23,0.30) 0%, rgba(2,6,23,0.20) 45%, rgba(2,6,23,0.88) 100%), url(${backgroundUrl})`
    : 'linear-gradient(to bottom, rgba(2,6,23,0.60) 0%, rgba(2,6,23,0.85) 100%)';
  const count = category.product_count ?? category.productCount ?? 0;

  return (
    <Link
      to={`/shop/${category.slug}`}
      aria-label={`Explore ${category.name} — ${count} products`}
      className="group card relative min-h-[300px] overflow-hidden rounded-3xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lift"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
        style={{ backgroundColor: fallbackColor, backgroundImage: bgImage }}
      />
      {category.icon && (
        <div className="absolute left-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-sm backdrop-blur">
          <Icon name={category.icon} size={22} className={iconBg[category.color]} strokeWidth={2.2} />
        </div>
      )}
      <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-6">
        <span className="badge w-fit bg-white/90 text-slate-800 backdrop-blur">{count} products</span>
        <h3 className="mt-3 font-display text-2xl font-bold text-white drop-shadow-sm">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-3 max-w-md text-sm leading-relaxed text-slate-100/90">
          {category.description || category.tagline}
        </p>
        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
          Explore {category.name}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}