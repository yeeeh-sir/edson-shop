import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useFavorites } from '../../context/FavoritesContext';
import { getProduct } from '../../services/api';

export default function Favorites() {
  const { ids } = useFavorites();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    Promise.all(ids.map((id) => getProduct(id).catch(() => null))).then((products) => {
      setFavorites(products.filter(Boolean));
    });
  }, [ids]);

  return (
    <div className="container-site py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
            Home <span className="mx-1">/</span> <span className="font-semibold text-slate-700">Favorites</span>
          </nav>
          <h1 className="mt-2 flex items-center gap-2.5 font-display text-3xl font-bold text-slate-900">
            My Favorites
            <Heart size={28} className="fill-rose-500 text-rose-500" />
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {favorites.length} saved item{favorites.length === 1 ? '' : 's'} — saved on this device.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            message="Tap the heart on any product to save it here for later."
            icon="Heart"
            action={<Link to="/shop" className="btn-primary">Browse products</Link>}
          />
        ) : (
          <ProductGrid products={favorites} />
        )}
      </div>
    </div>
  );
}