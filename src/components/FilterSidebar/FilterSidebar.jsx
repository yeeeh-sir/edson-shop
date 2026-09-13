import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { formatPrice, getCategories, getProducts } from '../../services/api';

const RATINGS = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4.0 & up' },
  { value: 4.5, label: '4.5 & up' },
  { value: 4.8, label: '4.8 & up' },
];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const [categories, setCategories] = useState([]);
  const [subcats, setSubcats] = useState({});

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (filters.category === 'all') return;
    getProducts({ category: filters.category, limit: 100 }).then((data) => {
      const values = [...new Set((data.products || []).map((product) => product.subcategory).filter(Boolean))];
      setSubcats((previous) => ({ ...previous, [filters.category]: values }));
    }).catch(() => { });
  }, [filters.category]);

  const toggleCat = (slug) => {
    onChange({ category: slug === filters.category ? 'all' : slug, subcategory: 'all' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <SlidersHorizontal size={17} className="text-brand-600" />
          Filters
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-brand-600"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <section className="border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ category: 'all', subcategory: 'all' })}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filters.category === 'all'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            All categories
            <span className="text-xs text-slate-400" />
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c.slug}
              onClick={() => toggleCat(c.slug)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filters.category === c.slug
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {c.name}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {c.product_count ?? 0}
              </span>
            </button>
          ))}
        </div>
      </section>

      {filters.category !== 'all' && subcats[filters.category] && (
        <section className="border-t border-slate-100 pt-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Subcategory</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChange({ subcategory: 'all' })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filters.subcategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              All
            </button>
            {subcats[filters.category].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => onChange({ subcategory: s })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filters.subcategory === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Maximum price — {formatPrice(filters.priceMax)}
        </h4>
        <input
          type="range"
          min="0"
          max="1200"
          step="5"
          value={filters.priceMax}
          onChange={(e) => onChange({ priceMax: Number(e.target.value) })}
          className="w-full accent-brand-600"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(1200000)}</span>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Rating</h4>
        <div className="flex flex-col gap-1.5">
          {RATINGS.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r.value}
                onChange={() => onChange({ minRating: r.value })}
                className="h-4 w-4 accent-brand-600"
              />
              {r.label}
            </label>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Availability</h4>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded accent-brand-600"
          />
          In stock only
        </label>
      </section>
    </div>
  );
}