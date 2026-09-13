import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { getMyPayments, getOrders, formatPrice } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const badge = (value) => value === 'paid' || value === 'approved' ? 'bg-emerald-100 text-emerald-700' : value === 'failed' || value === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700';

export default function Dashboard() {
    const { user } = useAuth();
    const [state, setState] = useState({ loading: true, orders: [], payments: [], error: '' });

    useEffect(() => {
        Promise.all([getOrders(1, 5), getMyPayments()])
            .then(([orders, payments]) => setState({ loading: false, orders: orders.orders || [], payments: payments.payments || [], error: '' }))
            .catch((error) => setState({ loading: false, orders: [], payments: [], error: error.message }));
    }, []);

    if (state.loading) return <div className="container-site py-12"><div className="animate-pulse space-y-5"><div className="h-8 w-56 rounded bg-slate-200" /><div className="grid gap-4 sm:grid-cols-3"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-28 rounded-2xl bg-slate-200" /></div></div></div>;
    if (state.error) return <div className="container-site py-12"><div role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-semibold text-rose-700">Unable to load your dashboard. {state.error}</div></div>;

    const approved = state.payments.filter((payment) => payment.status === 'approved').length;
    const pending = state.orders.filter((order) => order.status === 'pending').length;
    const cards = [
        { label: 'Total orders', value: state.orders.length, icon: Package, color: 'bg-brand-100 text-brand-700' },
        { label: 'Pending orders', value: pending, icon: Clock, color: 'bg-amber-100 text-amber-700' },
        { label: 'Approved payments', value: approved, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
    ];

    return <div className="container-site py-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">Welcome back</p><h1 className="mt-1 font-display text-3xl font-bold text-slate-900">{user?.full_name || 'Your dashboard'}</h1><p className="mt-2 text-sm text-slate-500">Track orders, payments, and your account in one place.</p></div><Link to="/shop" className="btn-primary">Continue shopping <ArrowRight size={16} /></Link></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="card flex items-center gap-4 p-5"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}><Icon size={21} /></span><div><p className="font-display text-2xl font-bold text-slate-900">{value}</p><p className="text-sm text-slate-500">{label}</p></div></div>)}</div>
        <section className="mt-8 card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-display text-lg font-bold text-slate-900">Recent orders</h2><p className="text-xs text-slate-500">Your latest purchases and payment status.</p></div><Link to="/my-orders" className="text-sm font-semibold text-brand-600">View all</Link></div><div className="divide-y divide-slate-100">{state.orders.length ? state.orders.map((order) => <Link key={order.id} to={`/my-orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:px-6"><div><p className="font-semibold text-slate-800">{order.order_number}</p><p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><span className={`badge ${badge(order.payment_status)}`}>Payment: {order.payment_status}</span><span className="badge bg-slate-100 text-slate-600">{order.status}</span></div><span className="font-bold text-slate-800">{formatPrice(Number(order.total))}</span></Link>) : <div className="px-6 py-10 text-center text-sm text-slate-500">No orders yet. <Link to="/shop" className="font-semibold text-brand-700">Start shopping</Link></div>}</div></section>
        <section className="mt-6 grid gap-4 sm:grid-cols-2"><Link to="/my-payments" className="card flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lift"><span className="flex items-center gap-3"><CreditCard className="text-brand-600" /><span><strong className="block text-sm text-slate-800">My payments</strong><small className="text-slate-500">Review submitted payment confirmations</small></span></span><ArrowRight size={17} className="text-slate-400" /></Link><Link to="/profile" className="card flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lift"><span><strong className="block text-sm text-slate-800">Account profile</strong><small className="text-slate-500">Keep your delivery details up to date</small></span><ArrowRight size={17} className="text-slate-400" /></Link></section>
    </div>;
}
