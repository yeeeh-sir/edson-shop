import React from 'react';

export default function LoadingSpinner({ label = 'Loading…', size = 'md' }) {
  const dims = size === 'lg' ? 'h-10 w-10 border-4' : size === 'sm' ? 'h-5 w-5 border-2' : 'h-8 w-8 border-[3px]';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500" role="status">
      <div
        className={`${dims} animate-spin rounded-full border-brand-600 border-t-transparent`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}