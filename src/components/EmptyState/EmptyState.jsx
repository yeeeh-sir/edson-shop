import React from 'react';
import Icon from '../IconSet';

export default function EmptyState({ title = 'Nothing here yet', message, action, icon = 'Package' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon name={icon} size={32} />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
        {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
      </div>
      {action}
    </div>
  );
}