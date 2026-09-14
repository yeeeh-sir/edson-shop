import React from 'react';
import { Star } from 'lucide-react';

export default function Rating({ rating, reviews, showValue = true, size = 'md' }) {
  const value = rating || 0;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5 text-brand-300" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size === 'sm' ? 13 : 15}
            className={i <= Math.round(value) ? 'text-brand-500' : 'text-brand-200'}
            fill={i <= Math.round(value) ? 'currentColor' : 'none'}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-ink-600">
          {value || '—'}
          {typeof reviews === 'number' && (
            <span className="font-medium text-ink-300"> ({reviews})</span>
          )}
        </span>
      )}
    </div>
  );
}