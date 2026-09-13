import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/api';
import SearchBar from '../SearchBar/SearchBar';
import Logo from '../Logo/Logo';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${isActive ? 'bg-brand-500 text-black' : 'text-slate-200 hover:bg-white/10 hover:text-brand-300'
  }`;

function BadgePill({ value }) {
  if (!value) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {value > 99 ? '99+' : value}
    </span>
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const { user, signOut } = useAuth();
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...categories.map((category) => ({ label: category.name, to: `/shop/${category.slug}` })),
  ];

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const goSearch = (path) => {
    navigate(path);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-brand-500/40 bg-[#0b0b0b]/95 text-white backdrop-blur-lg">
        <div className="container-site flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Edson Shop home">
            <Logo className="h-12 w-12 lg:h-14 lg:w-14" />
            <span className="hidden font-display text-lg font-bold tracking-tight text-white sm:block">Edson Shop</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className={`rounded-lg p-2.5 transition ${searchOpen ? 'bg-brand-500 text-black' : 'text-slate-200 hover:bg-white/10'}`}
            >
              <Search size={20} />
            </button>

            <Link
              to="/favorites"
              aria-label="Favorites"
              className="relative hidden rounded-lg p-2.5 text-slate-200 transition hover:bg-white/10 hover:text-brand-300 sm:block"
            >
              <Heart size={20} />
              <BadgePill value={favCount} />
            </Link>

            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative rounded-lg p-2.5 text-slate-200 transition hover:bg-white/10 hover:text-brand-300"
            >
              <ShoppingCart size={20} />
              <BadgePill value={count} />
            </Link>

            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className="flex items-center gap-1 rounded-lg p-2.5 text-slate-200 transition hover:bg-white/10 hover:text-brand-300"
              >
                <User size={20} />
                <ChevronDown size={15} className={accountOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 animate-scale-in overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-lift">
                  <p className="px-4 pb-2 pt-1 text-xs font-medium text-slate-400">Account</p>
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Dashboard</Link>
                      <Link to="/my-orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">My Orders</Link>
                      <Link to="/my-payments" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">My Payments</Link>
                      <Link to="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Profile</Link>
                      <button type="button" onClick={() => { setAccountOpen(false); signOut(); }} className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link to="/login" state={{ from: '/checkout' }} onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">Continue with Google</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="border-t border-slate-100 pb-4 pt-3">
            <div className="container-site">
              <SearchBar autoFocus onSubmitted={undefined} />
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                <button type="button" onClick={() => goSearch('/shop?q=Headphones')} className="rounded-full bg-slate-100 px-3 py-1 font-medium transition hover:bg-brand-50 hover:text-brand-700">
                  Headphones
                </button>
                <button type="button" onClick={() => goSearch('/shop?q=Notebook')} className="rounded-full bg-slate-100 px-3 py-1 font-medium transition hover:bg-brand-50 hover:text-brand-700">
                  Notebooks
                </button>
                <button type="button" onClick={() => goSearch('/shop?q=Logo')} className="rounded-full bg-slate-100 px-3 py-1 font-medium transition hover:bg-brand-50 hover:text-brand-700">
                  Logo design
                </button>
                <button type="button" onClick={() => goSearch('/shop?q=Banner')} className="rounded-full bg-slate-100 px-3 py-1 font-medium transition hover:bg-brand-50 hover:text-brand-700">
                  Banners
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] animate-slide-in-right flex-col bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
                <Logo className="h-12 w-12" />
                <span className="font-display text-lg font-bold tracking-tight text-slate-900">Edson Shop</span>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `mb-1 block rounded-xl px-4 py-2.5 text-[15px] font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">More</p>
                <Link to="/favorites" onClick={() => setDrawerOpen(false)} className="mb-1 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Heart size={17} /> Favorites
                </Link>
                <Link to="/cart" onClick={() => setDrawerOpen(false)} className="mb-1 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50">
                  <ShoppingCart size={17} /> Cart
                </Link>
                <Link to="/graphics/request" onClick={() => setDrawerOpen(false)} className="mb-1 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Search size={17} /> Request a Design
                </Link>
              </div>
            </nav>
            <div className="border-t border-slate-100 p-4">
              <Link to="/shop" onClick={() => setDrawerOpen(false)} className="btn-primary block w-full text-center">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}