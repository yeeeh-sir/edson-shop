import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { clearToken, getAdminDashboard, getAdminPayments, getAdminProfile } from '../services/api';
import { formatPrice } from '../services/api';
import AdminProfileForm from './components/AdminProfileForm';

const statusColor = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-sky-100 text-sky-700',
  Shipped: 'bg-brand-100 text-brand-800',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminPayments({ limit: 100 })])
      .then(([data, paymentData]) => { setDashboard(data); setPayments(paymentData.payments || []); })
      .catch((err) => setError(err.message));
    getAdminProfile().then(setProfile).catch((err) => setError(err.message));
  }, []);

  if (error) return <div role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-semibold text-rose-700">{error}</div>;
  if (!dashboard) return <div className="rounded-xl bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">Loading live dashboard data...</div>;

  const s = dashboard.stats;
  const weeklySales = dashboard.charts?.weekly || [];
  const maxRevenue = Math.max(1, ...weeklySales.map((d) => Number(d.revenue)));

  const cards = [
    { icon: Package, label: 'Total Products', value: s.total_products, sub: 'Live catalogue', to: '/admin/products', color: 'from-brand-500 to-brand-700' },
    { icon: ShoppingBag, label: 'Total Orders', value: s.total_orders, sub: 'Non-cancelled', to: '/admin/orders', color: 'from-brand-600 to-brand-400' },
    { icon: Users, label: 'Customers', value: s.total_customers, sub: 'Registered customers', to: '/admin/customers', color: 'from-teal-500 to-teal-700' },
    { icon: DollarSign, label: 'Revenue', value: formatPrice(s.total_revenue), sub: 'Non-cancelled orders', to: '/admin/orders', color: 'from-emerald-500 to-emerald-700' },
    { icon: Clock, label: 'Pending Orders', value: s.pending_orders, sub: 'Need attention', to: '/admin/orders', color: 'from-amber-500 to-amber-700' },
    { icon: AlertTriangle, label: 'Low Stock', value: s.low_stock_products, sub: '10 units or fewer', to: '/admin/products', color: 'from-rose-500 to-rose-700' },
    { icon: Clock, label: 'Pending Payments', value: payments.filter((payment) => payment.status === 'pending').length, sub: 'Awaiting verification', to: '/admin/orders', color: 'from-orange-500 to-orange-700' },
    { icon: DollarSign, label: 'Approved Sales', value: formatPrice(payments.filter((payment) => payment.status === 'approved').reduce((sum, payment) => sum + Number(payment.amount), 0)), sub: 'Verified payments', to: '/admin/orders', color: 'from-emerald-600 to-teal-700' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of Edison Shop — {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to} className="card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={22} />
                </span>
                <TrendingUp size={18} className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-slate-900">{c.value}</p>
              <p className="text-sm font-semibold text-slate-500">{c.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{c.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Weekly sales */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Weekly sales</h2>
            <span className="badge bg-slate-100 text-slate-600">Live database data</span>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3">
            {weeklySales.map((d) => (
              <div key={d.day} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                  {formatPrice(Number(d.revenue))}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-300"
                  style={{ height: `${Math.max(8, (Number(d.revenue) / maxRevenue) * 190)}px` }}
                />
                <span className="text-xs font-semibold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category split */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900">Sales by category</h2>
          <div className="mt-6 space-y-4">
            {[
              ...(dashboard.charts?.category_split || []).map((item, index) => ({ name: item.name, pct: Number(item.products), color: ['bg-brand-500', 'bg-accent-400', 'bg-brand-700', 'bg-teal-500'][index % 4] })),
            ].map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{c.name}</span>
                  <span className="font-bold text-slate-500">{c.pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${c.color} transition-all duration-500`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-t border-slate-100 bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(dashboard.recent_orders || []).map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-3 font-bold text-slate-800">{o.order_number}</td>
                  <td className="px-6 py-3 text-slate-600">{o.customer_name || 'Guest'}</td>
                  <td className="px-6 py-3 text-slate-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-bold text-slate-800">{formatPrice(Number(o.total))}</td>
                  <td className="px-6 py-3">
                    <span className={`badge ${statusColor[o.status?.charAt(0).toUpperCase() + o.status?.slice(1)] || 'bg-slate-100 text-slate-600'}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {profile && (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">Admin security</h2>
            <p className="mt-1 text-sm text-slate-500">Change your administrator password from the dashboard.</p>
          </div>
          <AdminProfileForm
            profile={profile}
            showEmail={false}
            onPasswordChanged={() => {
              clearToken();
              navigate('/admin/login', { replace: true });
            }}
          />
        </section>
      )}
    </div>
  );
}