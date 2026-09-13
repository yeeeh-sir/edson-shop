import React from 'react';
import { Truck } from 'lucide-react';
import { formatPrice } from '../../services/api';

export default function CartSummary({ subtotal, delivery, total, showDeliveryNote = true }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Subtotal</span>
        <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Delivery</span>
        <span className="font-semibold text-slate-900">
          {delivery === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(delivery)}
        </span>
      </div>
      {showDeliveryNote && (
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Truck size={13} />
          Free delivery on orders over RWF 100,000
        </p>
      )}
      <div className="border-t border-dashed border-slate-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-base font-bold text-slate-900">Total</span>
          <span className="font-display text-xl font-bold text-brand-700">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}