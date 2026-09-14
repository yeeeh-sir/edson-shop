import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ title, subtitle, actionLabel, actionTo, light }) {
  const titleClass = `section-title ${light ? 'text-cream-50' : ''}`;
  const subtitleClass = `mt-2 max-w-2xl text-sm sm:text-base ${light ? 'text-brand-100' : 'text-ink-500'}`;
  const actionClass = `group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
    light ? 'text-brand-300 hover:text-brand-200' : 'text-brand-700 hover:text-brand-900'
  }`;

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? 'text-brand-300' : 'text-brand-500'}`}>
          Edison Shop
        </p>
        <h2 className={titleClass}>{title}</h2>
        {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      </div>
      {actionLabel && (
        <Link to={actionTo} className={actionClass}>
          {actionLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}