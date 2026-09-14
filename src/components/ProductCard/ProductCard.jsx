import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import Rating from '../Rating/Rating';
import ProductImage from '../ProductImage/ProductImage';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatPrice } from '../../services/api';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useFavorites();
  const navigate = useNavigate();
  const isFav = has(product.id);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (product.isService) {
      navigate('/graphics/request');
      return;
    }
    if (outOfStock) return;
    addItem(product, 1);
  };

  return (
    <article className="group flex h-full flex-col">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl bg-cream-200 ring-1 ring-ink-900/5">
        <Link to={`/product/${product.id}`} className="block" aria-label={product.name}>
          <ProductImage
            src={product.image}
            alt={product.name}
            width={600}
            ratio="aspect-[4/5]"
            imgClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.discount > 0 && (
            <span className="badge bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.isNew && !product.discount && (
            <span className="badge bg-ink-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream-50 shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFav}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm ring-1 transition-all duration-300 ${
            isFav
              ? 'bg-brand-500 text-white ring-brand-500'
              : 'bg-white/95 text-ink-500 ring-ink-900/5 hover:scale-110 hover:text-brand-500'
          }`}
        >
          <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink-900/80 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-cream-50 backdrop-blur-sm">
            Sold out
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-1 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-300">
            {product.categoryName}
          </p>
          <Rating rating={product.rating} size="sm" showValue={false} />
        </div>

        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-ink-900 transition-colors group-hover:text-brand-700"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-display text-[17px] font-semibold text-ink-900">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="text-[13px] text-ink-300 line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 bg-white py-2.5 text-[13px] font-semibold text-ink-800 transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 hover:text-white hover:shadow-[0_8px_18px_-8px_rgb(237_173_11/.55)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag size={15} />
          {product.isService ? 'Request Design' : 'Add to Bag'}
        </button>
      </div>
    </article>
  );
}