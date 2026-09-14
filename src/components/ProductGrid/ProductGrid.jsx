import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import EmptyState from '../EmptyState/EmptyState';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

function ProductCardSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="skeleton aspect-[4/5] w-full rounded-2xl" />
      <div className="px-1 pt-3.5">
        <div className="skeleton h-2.5 w-1/3" />
        <div className="skeleton mt-2 h-4 w-11/12" />
        <div className="skeleton mt-2.5 h-4 w-1/2" />
        <div className="skeleton mt-4 h-9 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products = [], loading = false, cols = 'sm' }) {
  const gridClass =
    cols === 'lg'
      ? 'grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (loading) {
    return (
      <div className={gridClass} aria-label="Loading products" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="Nothing here yet"
        message="Try adjusting your filters or search for something else."
        icon="Search"
        action={
          <Link to="/shop" className="btn-primary">
            <ShoppingBag size={16} />
            Browse the shop
          </Link>
        }
      />
    );
  }

  return (
    <div className={gridClass}>
      {products.map((p, i) => (
        <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 60, 420)}ms` }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}