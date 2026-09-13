import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import CartItem from '../../components/CartItem/CartItem';
import CartSummary from '../../components/CartSummary/CartSummary';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { items, subtotal, delivery, total } = useCart();

  return (
    <div className="container-site py-12">
      <nav className="text-xs text-slate-400" aria-label="Breadcrumb">
        Home <span className="mx-1">/</span> <span className="font-semibold text-slate-700">Cart</span>
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your cart is empty"
            message="Looks like you haven't added anything yet. Explore the shop to find something you love."
            icon="ShoppingBag"
            action={
              <Link to="/shop" className="btn-primary">
                <ShoppingBag size={16} />
                Start shopping
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="card divide-y divide-slate-100 px-5 sm:px-7">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold text-slate-900">Order Summary</h2>
              <div className="mt-4">
                <CartSummary subtotal={subtotal} delivery={delivery} total={total} />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link to="/checkout" className="btn-primary !w-full">
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link to="/shop" className="btn-ghost !w-full">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="card space-y-3 p-6 text-sm text-slate-500">
              <p className="flex items-center gap-2.5"><Truck size={17} className="text-brand-600" /> Free delivery on orders over RWF 100,000</p>
              <p className="flex items-center gap-2.5"><CreditCard size={17} className="text-brand-600" /> Secure payment — card, mobile money, bank</p>
              <p className="flex items-center gap-2.5"><ShieldCheck size={17} className="text-brand-600" /> 14-day hassle-free returns</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}