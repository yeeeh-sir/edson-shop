import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({ autoFocus, className = '' }) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} role="search" className={`relative ${className}`}>
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, services…"
        aria-label="Search products"
        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-brand-400 focus:bg-white focus:shadow-glow"
      />
    </form>
  );
}