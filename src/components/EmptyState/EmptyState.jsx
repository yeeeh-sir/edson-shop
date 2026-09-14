import React from 'react';
import Icon from '../IconSet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message, action, icon = 'Package', back = false }) {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-ink-200 bg-cream-100/60 px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <Icon name={icon} size={36} strokeWidth={1.4} />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-ink-900">{title}</h3>
        {message && <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">{message}</p>}
      </div>
      {action}
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-brand-700"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      )}
    </div>
  );
}