import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Icon from '../IconSet';
import { getCategoryImage } from '../../utils/categoryImages';

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);
  const image = getCategoryImage(category);
  const count = category.product_count ?? category.productCount ?? 0;

  return (
    <Link
      to={`/shop/${category.slug}`}
      aria-label={`Shop ${category.name}${count ? ` — ${count} products` : ''}`}
      className="group relative block overflow-hidden rounded-3xl ring-1 ring-ink-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-400/60"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-cream-200">
        {image && !imgError ? (
          <img
            src={image}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-cream-100 to-cream-200 text-brand-600">
            <Icon name={category.icon} size={52} strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-ink-900/5 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {count > 0 && (
          <span className="mb-2 inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-ink-700 backdrop-blur-sm">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        )}
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-white">{category.name}</h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white">
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}