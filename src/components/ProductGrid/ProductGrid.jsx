import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import EmptyState from '../EmptyState/EmptyState';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function ProductGrid({ products = [], loading = false, cols = 'sm' }) {
  if (loading) return <LoadingSpinner />;

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
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

  const gridClass =
    cols === 'lg'
      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={gridClass}>
      {products.map((p, i) => (
        <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}