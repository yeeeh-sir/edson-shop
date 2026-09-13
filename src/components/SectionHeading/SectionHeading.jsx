import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ title, subtitle, actionLabel, actionTo, light }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2
          className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${light ? 'text-white' : 'text-slate-900'
            }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-2 max-w-2xl text-sm sm:text-base ${light ? 'text-brand-100' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {actionLabel && (
        <Link
          to={actionTo}
          className={`group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${light ? 'text-accent-300 hover:text-accent-200' : 'text-brand-600 hover:text-brand-700'
            }`}
        >
          {actionLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}