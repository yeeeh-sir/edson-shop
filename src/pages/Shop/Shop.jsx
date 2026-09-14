import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, PackageOpen } from 'lucide-react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import { formatPrice, getCategories } from '../../services/api';

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
];

const parseFilters = (params, routeCategory) => {
  const p = routeCategory || params.get('category') || 'all';
  return {
    q: params.get('q') || '',
    category: p,
    subcategory: params.get('subcategory') || 'all',
    priceMax: Number(params.get('priceMax')) || 0,
    minRating: Number(params.get('rating') || 0),
    inStockOnly: params.get('inStock') === '1',
    sort: params.get('sort') || 'popular',
  };
};

export default function Shop() {
  const { category: routeCategory } = useParams();
  const [params, setParams] = useSearchParams();
  const initial = parseFilters(params, routeCategory);
  const [filters, setFilters] = useState(initial);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(initial.q);
  const [categories, setCategories] = useState([]);

  const currentCategory = routeCategory || filters.category;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setFilters((f) => ({ ...f, category: routeCategory || params.get('category') || 'all' }));
    setSearchInput(params.get('q') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCategory]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .fetchProducts({
        query: filters.q,
        category: currentCategory,
        subcategory: filters.subcategory,
        priceMax: filters.priceMax || undefined,
        minRating: filters.minRating,
        inStockOnly: filters.inStockOnly,
        sort: filters.sort,
      })
      .then((list) => {
        if (alive) setResults(list);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentCategory]);

  const updateFilter = (patch) => {
    const next = { ...filters, ...patch };
    const sp = new URLSearchParams();
    if (next.q) sp.set('q', next.q);
    if (currentCategory !== 'all') sp.set('category', currentCategory);
    if (next.subcategory !== 'all') sp.set('subcategory', next.subcategory);
    if (next.priceMax > 0) sp.set('priceMax', String(next.priceMax));
    if (next.minRating) sp.set('rating', String(next.minRating));
    if (next.inStockOnly) sp.set('inStock', '1');
    if (next.sort !== 'popular') sp.set('sort', next.sort);
    setParams(sp, { replace: true });
    setFilters(next);
  };

  const resetFilters = () => {
    updateFilter({ category: currentCategory === 'all' ? 'all' : currentCategory, subcategory: 'all', priceMax: 0, minRating: 0, inStockOnly: false });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateFilter({ q: searchInput.trim() });
  };

  const heading = categories.find((category) => category.slug === currentCategory)?.name || 'All Products';

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.subcategory !== 'all') n += 1;
    if (filters.priceMax > 0) n += 1;
    if (filters.minRating) n += 1;
    if (filters.inStockOnly) n += 1;
    if (filters.q) n += 1;
    return n;
  }, [filters]);

  const sidebar = (
    <FilterSidebar filters={filters} onChange={updateFilter} onReset={resetFilters} />
  );

  return (
    <div>
      {/* Page head */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-site py-8">
          <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
            Home <span className="mx-1">/</span> Shop
            {currentCategory !== 'all' && (
              <>
                <span className="mx-1">/</span>
                <span className="font-semibold text-brand-600">{heading}</span>
              </>
            )}
          </nav>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">{heading}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? 'Loading…' : `${results.length} product${results.length === 1 ? '' : 's'} found`}
          </p>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="card sticky top-40 p-5">{sidebar}</div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <form onSubmit={submitSearch} className="relative min-w-0 flex-1 sm:max-w-xs">
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search in shop…"
                  aria-label="Search in shop"
                  className="input rounded-full !pl-10"
                />
              </form>

              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn-ghost relative shrink-0 lg:hidden"
                aria-haspopup="dialog"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="ml-auto flex items-center gap-3">
                <label htmlFor="sort" className="hidden text-sm text-slate-500 sm:block">Sort:</label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => updateFilter({ sort: e.target.value })}
                  className="input w-auto rounded-full !py-2 pr-9"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400">Active filters:</span>
                {filters.q && (
                  <span className="badge border border-slate-200 bg-white text-slate-600">
                    “{filters.q}”
                    <button type="button" onClick={() => { updateFilter({ q: '' }); setSearchInput(''); }} aria-label="Clear search" className="ml-1 text-slate-400 hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.subcategory !== 'all' && (
                  <span className="badge border border-slate-200 bg-white text-slate-600">
                    {filters.subcategory}
                    <button type="button" onClick={() => updateFilter({ subcategory: 'all' })} aria-label="Clear subcategory" className="ml-1 text-slate-400 hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.priceMax > 0 && (
                  <span className="badge border border-slate-200 bg-white text-slate-600">
                    Under {formatPrice(filters.priceMax)}
                    <button type="button" onClick={() => updateFilter({ priceMax: 0 })} aria-label="Clear price" className="ml-1 text-slate-400 hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span className="badge border border-slate-200 bg-white text-slate-600">
                    {filters.minRating}+ stars
                    <button type="button" onClick={() => updateFilter({ minRating: 0 })} aria-label="Clear rating" className="ml-1 text-slate-400 hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {filters.inStockOnly && (
                  <span className="badge border border-slate-200 bg-white text-slate-600">
                    In stock
                    <button type="button" onClick={() => updateFilter({ inStockOnly: false })} aria-label="Clear stock filter" className="ml-1 text-slate-400 hover:text-rose-500">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button type="button" onClick={resetFilters} className="ml-1 font-semibold text-brand-600 hover:text-brand-700">
                  Clear all
                </button>
              </div>
            )}

            {categories.length > 0 && currentCategory === 'all' && (
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <PackageOpen size={15} className="text-brand-500" /> Quick browse:
                </span>
                {categories.map((c) => (
                  <a
                    key={c.slug}
                    href={`#/${c.slug}`}
                    onClick={(e) => { e.preventDefault(); updateFilter({ category: c.slug }); }}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            )}

            {loading ? (
              <ProductGrid products={[]} loading />
            ) : results.length ? (
              <ProductGrid products={results} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <PackageOpen size={40} className="mx-auto text-slate-300" />
                <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">Nothing matches</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  Try removing a filter or search for something different.
                </p>
                <button type="button" onClick={resetFilters} className="btn-primary mt-5">
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        {sidebar}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => { resetFilters(); setFiltersOpen(false); }} className="btn-ghost flex-1">
            Reset
          </button>
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary flex-1">
            Show {results.length} results
          </button>
        </div>
      </Modal>
    </div>
  );
}