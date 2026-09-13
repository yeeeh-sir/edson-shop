import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
        This page wandered off
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        The page you are looking for doesn’t exist or may have moved. Let’s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home size={16} />
          Go home
        </Link>
        <Link to="/shop" className="btn-ghost">
          <PackageSearch size={16} />
          Browse the shop
        </Link>
      </div>
    </div>
  );
}