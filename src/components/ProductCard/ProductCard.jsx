import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
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
    <article className="group card relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/product/${product.id}`} className="relative block">
        <ProductImage
          src={product.image}
          alt={product.name}
          width={480}
          ratio="square"
          cover
          imgClassName="transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="badge bg-rose-500 text-white shadow-sm">
              -{product.discount}% OFF
            </span>
          )}
          {product.isNew && !product.discount && (
            <span className="badge bg-brand-600 text-white shadow-sm">NEW</span>
          )}
        </div>
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
        {!outOfStock && product.stock <= 10 && (
          <span className="absolute left-3 top-3 right-auto mt-10">
            <span className="badge bg-accent-100 text-accent-800 shadow-sm">
              Only {product.stock} left
            </span>
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFav}
        className={`absolute right-3 top-3 rounded-full p-2 shadow-sm transition-all duration-300 ease-in-out ${isFav
            ? 'scale-110 bg-rose-500 text-white'
            : 'bg-white/90 text-slate-500 hover:scale-110 hover:bg-white hover:text-rose-500'
          }`}
      >
        <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/product/${product.id}`}
            className="text-[11px] font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-700"
          >
            {product.categoryName} · {product.subcategory}
          </Link>
          <Rating rating={product.rating} size="sm" showValue={false} />
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            {product.isService && (
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Starting at
              </p>
            )}
            <p className="font-display text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</p>
            )}
          </div>
          <span
            className={`text-xs font-semibold ${outOfStock ? 'text-rose-500' : product.stock <= 10 ? 'text-accent-600' : 'text-emerald-600'
              }`}
          >
            {outOfStock ? 'Sold out' : product.stock <= 10 ? 'Low stock' : 'In stock'}
          </span>
        </div>

        <div className="mt-3 flex gap-2">
          <button type="button" onClick={handleAdd} className="btn-primary flex-1 !px-3 !py-2 text-[13px]">
            <ShoppingCart size={15} />
            {product.isService ? 'Request Design' : 'Add to Cart'}
          </button>
          <Link
            to={`/product/${product.id}`}
            aria-label={`View details of ${product.name}`}
            className="btn-ghost !px-3 !py-2 text-[13px]"
          >
            <Eye size={15} />
            <span className="sr-only sm:not-sr-only">Details</span>
          </Link>
        </div>
      </div>
    </article>
  );
}