import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../services/api';
import ProductImage from '../ProductImage/ProductImage';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-5">
      <Link
        to={`/product/${item.id}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink-900/5"
        aria-label={item.name}
      >
        <ProductImage src={item.image} alt={item.name} width={160} ratio="square" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/product/${item.id}`}
          className="line-clamp-1 font-display text-sm font-semibold text-ink-900 hover:text-brand-700"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 truncate text-xs text-ink-400">
          {item.categoryName}
          {item.subcategory && ` · ${item.subcategory}`}
        </p>
        <p className="mt-1 text-sm font-bold text-ink-900">
          {formatPrice(item.price)}
          {item.oldPrice && (
            <span className="ml-2 text-xs font-normal text-ink-300 line-through">{formatPrice(item.oldPrice)}</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-ink-200 p-1">
        <button
          type="button"
          onClick={() => updateQty(item.id, item.qty - 1)}
          aria-label={`Decrease quantity of ${item.name}`}
          className="rounded-full p-1.5 text-ink-500 transition hover:bg-cream-100"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-bold text-ink-900" aria-label="Quantity">
          {item.qty}
        </span>
        <button
          type="button"
          onClick={() => updateQty(item.id, item.qty + 1)}
          aria-label={`Increase quantity of ${item.name}`}
          className="rounded-full p-1.5 text-ink-500 transition hover:bg-cream-100"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-24 text-right font-display text-sm font-bold text-ink-900">
        {formatPrice(item.price * item.qty)}
      </p>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="rounded-lg p-2 text-ink-300 transition hover:bg-blush-50 hover:text-blush-600"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}