import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  ShoppingBag,
  Users,
  Palette,
  Settings,
  UserRound,
  Menu,
  X,
  Bell,
  ShoppingCart,
  LogOut,
} from 'lucide-react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import { getAdminPayments, logout } from '../services/api';
import Logo from '../components/Logo/Logo';

const NAV = [
  { section: 'Overview' },
  { to: '/admin/dashboard', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Catalog' },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/add', label: 'Add Product', icon: PlusCircle },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { section: 'Sales & Customers' },
  { to: '/admin/orders', label: 'Orders & Payments', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { section: 'Management' },
  { to: '/admin/graphics', label: 'Graphics', icon: Palette },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/profile', label: 'Profile', icon: UserRound },
];

function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-300">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-5">
        <Logo className="h-11 w-11" />
        <div>
          <p className="font-display text-sm font-bold text-white">Edson Admin</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Shop Manager</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {NAV.map((n) => n.section ? <p key={n.section} className="px-3.5 pb-1 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">{n.section}</p> : (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-500 text-black shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <n.icon size={17} />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <button type="button" onClick={async () => { await logout(); window.location.href = '/admin/login'; }} className="mb-2 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <LogOut size={16} /> Log out
        </button>
        <Link to="/shop" className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
          <ShoppingCart size={16} />
          View storefront
        </Link>
      </div>
    </div>
  );
}

function AdminLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationRef = useRef(null);
  const { productCount, serviceCount } = useAdmin();

  useEffect(() => {
    setNotificationsLoading(true);
    getAdminPayments({ status: 'pending', limit: 5 })
      .then((data) => setNotifications(data.payments || []))
      .catch(() => setNotifications([]))
      .finally(() => setNotificationsLoading(false));
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-fade-in bg-slate-950 pr-4">
            <div className="absolute right-2 top-3 z-10">
              <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close admin menu" className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-lg sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open admin menu">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <Logo className="h-9 w-9" />
              <span className="badge bg-brand-50 text-brand-700">{productCount} products</span>
              <span className="hidden badge bg-brand-50 text-brand-800 sm:inline-flex">{serviceCount} services</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label={`Notifications${notifications.length ? `, ${notifications.length} pending` : ''}`}
                aria-expanded={notificationsOpen}
              >
                <Bell size={19} />
                {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{notifications.length > 9 ? '9+' : notifications.length}</span>}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div><h2 className="font-display text-sm font-bold text-slate-900">Notifications</h2><p className="text-xs text-slate-400">Live payment activity</p></div>
                    <span className="badge bg-amber-100 text-amber-700">{notifications.length} pending</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsLoading && <p className="px-4 py-6 text-center text-sm text-slate-500">Loading notifications...</p>}
                    {!notificationsLoading && notifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-slate-500">You are all caught up.</p>}
                    {!notificationsLoading && notifications.map((payment) => (
                      <Link key={payment.id} to="/admin/orders" onClick={() => setNotificationsOpen(false)} className="block border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50">
                        <div className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" /><div className="min-w-0"><p className="text-sm font-semibold text-slate-800">Payment awaiting review</p><p className="mt-0.5 truncate text-xs text-slate-500">{payment.full_name || 'Customer'} · {payment.order_number}</p><p className="mt-1 text-[11px] text-slate-400">{new Date(payment.created_at).toLocaleString()}</p></div></div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/admin/orders" onClick={() => setNotificationsOpen(false)} className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50">View payment queue</Link>
                </div>
              )}
            </div>
            <button type="button" onClick={async () => { await logout(); window.location.href = '/admin/login'; }} className="ml-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Log out</button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">Edson Admin</p>
              <p className="text-[11px] text-slate-400">Super admin</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminLayoutInner />
    </AdminProvider>
  );
}
