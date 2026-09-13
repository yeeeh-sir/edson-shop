import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../services/api';

const FALLBACK = `${process.env.PUBLIC_URL}/images/fallback.svg`;

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap">
      <Link
        to={`/product/${item.id}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/product/${item.id}`}
          className="line-clamp-1 font-display text-sm font-semibold text-slate-900 hover:text-brand-700"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-xs text-slate-500">
          {item.categoryName} · {item.subcategory}
        </p>
        <p className="mt-1 text-sm font-bold text-slate-900">
          {formatPrice(item.price)}
          {item.oldPrice && <span className="ml-2 text-xs font-normal text-slate-400 line-through">{formatPrice(item.oldPrice)}</span>}
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
        <button
          type="button"
          onClick={() => updateQty(item.id, item.qty - 1)}
          aria-label={`Decrease quantity of ${item.name}`}
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-bold text-slate-900" aria-label="Quantity">
          {item.qty}
        </span>
        <button
          type="button"
          onClick={() => updateQty(item.id, item.qty + 1)}
          aria-label={`Increase quantity of ${item.name}`}
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-24 text-right font-display text-sm font-bold text-slate-900">
        {formatPrice(item.price * item.qty)}
      </p>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}