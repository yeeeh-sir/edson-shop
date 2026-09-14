import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  CreditCard,
  Settings,
  UserRound,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/api';
import Logo from '../Logo/Logo';
import Avatar from '../Avatar/Avatar';

function BadgePill({ value }) {
  if (!value) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-brand-950 ring-2 ring-white">
      {value > 99 ? '99+' : value}
    </span>
  );
}

const accountLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-orders', label: 'My Orders', icon: Package },
  { to: '/my-payments', label: 'My Payments', icon: CreditCard },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

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

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...categories.map((category) => ({ label: category.name, to: `/shop/${category.slug}` })),
  ];

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
      isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-600 hover:bg-cream-100 hover:text-ink-900'
    }`;

  const iconBtn =
    'relative rounded-full p-2.5 text-ink-600 transition-colors hover:bg-cream-100 hover:text-ink-900';

  const closeSearchOnNav = () => setSearchOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-ink-100 bg-white/90 backdrop-blur-md">
        <div className="container-site flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-full p-2 text-ink-600 transition hover:bg-cream-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Edison Shop home">
            <Logo className="h-11 w-11 lg:h-[52px] lg:w-[52px]" />
            <span className="hidden font-display text-lg font-bold tracking-tight text-ink-900 sm:block">
              Edison Shop
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={navLinkClass} onClick={closeSearchOnNav}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? 'Close search' : 'Search'}
              aria-expanded={searchOpen}
              className={`${iconBtn} ${searchOpen ? 'text-brand-700' : ''}`}
            >
              <Search size={20} />
            </button>

            <Link to="/favorites" aria-label="Favorites" className={`${iconBtn} hidden sm:block`} onClick={closeSearchOnNav}>
              <Heart size={20} />
              <BadgePill value={favCount} />
            </Link>

            <Link to="/cart" aria-label="Shopping bag" className={iconBtn} onClick={closeSearchOnNav}>
              <ShoppingBag size={20} />
              <BadgePill value={count} />
            </Link>

            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className={`relative flex items-center gap-0.5 ${iconBtn}`}
              >
                <User size={20} />
                <ChevronDown size={14} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2.5 w-60 animate-scale-in overflow-hidden rounded-2xl border border-ink-100 bg-white py-2 shadow-lift">
                  <div className="border-b border-ink-50 px-5 py-3">
                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar src={user.profile_image} name={user.full_name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">{user.full_name}</p>
                          <p className="truncate text-xs text-ink-400">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-ink-900">Welcome</p>
                        <p className="text-xs text-ink-400">Sign in to your account</p>
                      </>
                    )}
                  </div>
                  <div className="p-1.5">
                    {user ? (
                      <>
                        {accountLinks.map((l) => {
                          const IconCmp = l.icon;
                          return (
                            <Link
                              key={l.to}
                              to={l.to}
                              onClick={() => setAccountOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm text-ink-600 transition hover:bg-cream-100 hover:text-ink-900"
                            >
                              <IconCmp size={16} className="text-ink-300" />
                              {l.label}
                            </Link>
                          );
                        })}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm text-brand-700 transition hover:bg-brand-50"
                          >
                            <Settings size={16} />
                            Admin area
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setAccountOpen(false);
                            signOut();
                            navigate('/');
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm text-ink-600 transition hover:bg-cream-100 hover:text-ink-900"
                        >
                          <LogOut size={16} className="text-ink-300" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        state={{ from: '/checkout' }}
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-lg bg-brand-500 px-3.5 py-2 text-center text-sm font-semibold text-brand-950 transition hover:bg-brand-400"
                      >
                        Sign in
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="border-t border-ink-50 pb-4 pt-3 animate-fade-in">
            <div className="container-site">
              <SearchBarInline onDone={closeSearchOnNav} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="absolute inset-0 animate-fade-in bg-ink-900/45" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] animate-slide-in-right flex-col bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
                <Logo className="h-12 w-12" />
                <span className="font-display text-lg font-bold tracking-tight text-ink-900">
                  Edison Shop
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2 text-ink-500 transition hover:bg-cream-100"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile navigation">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `mb-1 block rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                      isActive ? 'bg-brand-100 text-brand-800' : 'text-ink-700 hover:bg-cream-100'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-4 border-t border-ink-100 pt-4">
                <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">Account</p>
                {user ? (
                  <>
                    <div className="mb-2 flex items-center gap-3 rounded-xl bg-cream-50 px-4 py-3">
                      <Avatar src={user.profile_image} name={user.full_name} size={40} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900">{user.full_name}</p>
                        <p className="truncate text-xs text-ink-400">{user.email}</p>
                      </div>
                    </div>
                    {accountLinks.map((l) => {
                      const IconCmp = l.icon;
                      return (
                        <Link
                          key={l.to}
                          to={l.to}
                          onClick={() => setDrawerOpen(false)}
                          className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-cream-100"
                        >
                          <IconCmp size={17} className="text-ink-300" />
                          {l.label}
                        </Link>
                      );
                    })}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDrawerOpen(false)}
                        className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-brand-700 transition hover:bg-brand-50"
                      >
                        <Settings size={17} />
                        Admin area
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        signOut();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-cream-100"
                    >
                      <LogOut size={17} className="text-ink-300" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: '/checkout' }}
                    onClick={() => setDrawerOpen(false)}
                    className="btn-primary mt-1 block w-full text-center"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchBarInline({ onDone }) {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    onDone();
    navigate(`/shop?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={submit} role="search" className="relative mx-auto max-w-xl">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        placeholder="Search the shop…"
        aria-label="Search products"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onDone();
        }}
        className="w-full rounded-full border border-ink-200 bg-cream-100 py-2.5 pl-11 pr-4 text-sm text-ink-800 placeholder-ink-300 transition-all duration-300 focus:border-brand-400 focus:bg-white focus:shadow-glow"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold text-brand-950 transition hover:bg-brand-400"
      >
        Search
      </button>
    </form>
  );
}