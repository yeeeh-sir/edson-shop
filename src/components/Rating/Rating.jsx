import React from 'react';

export default function Rating({ rating, reviews, showValue = true, size = 'md' }) {
  const pct = rating ? Math.max(0, Math.min(100, (rating / 5) * 100)) : 0;
  const box = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rating} out of 5`}>
      <div className="relative inline-flex">
        <div className={`flex text-slate-200 ${size === 'sm' ? 'gap-0.5' : 'gap-0.5'}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 20 20" className={box} fill="currentColor">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${pct}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 20 20" className={`${box} shrink-0`} fill="currentColor">
              <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-600">
          {rating || '—'}
          {typeof reviews === 'number' && (
            <span className="font-medium text-slate-400"> ({reviews})</span>
          )}
        </span>
      )}
    </div>
  );
}