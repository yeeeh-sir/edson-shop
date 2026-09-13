import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';
import { formatPrice } from '../../services/api';

export default function Orders() {
    const [state, setState] = useState({ loading: true, orders: [], error: '' });
    useEffect(() => {
        getOrders().then((data) => setState({ loading: false, orders: data.orders || [], error: '' })).catch((error) => setState({ loading: false, orders: [], error: error.message }));
    }, []);
    return <div className="container-site py-12"><h1 className="font-display text-3xl font-bold text-slate-900">My Orders</h1>
        {state.loading && <p className="mt-6 text-sm text-slate-500">Loading your orders...</p>}
        {state.error && <p role="alert" className="mt-6 rounded-lg bg-rose-50 p-4 text-sm font-semibold text-rose-700">{state.error}</p>}
        {!state.loading && !state.error && state.orders.length === 0 && <p className="mt-6 text-sm text-slate-500">You have not placed any orders yet. <Link className="font-semibold text-brand-700" to="/shop">Start shopping</Link></p>}
        <div className="mt-6 space-y-3">{state.orders.map((order) => <article key={order.id} className="card flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold text-slate-900">{order.order_number}</p><p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p></div><div className="flex gap-2"><span className="badge bg-slate-100 text-slate-700">Order: {order.status}</span><span className={`badge ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : order.payment_status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>Payment: {order.payment_status}</span></div><span className="font-bold text-slate-900">{formatPrice(Number(order.total))}</span></article>)}</div>
    </div>;
}
