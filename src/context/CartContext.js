import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoreSettings } from '../services/api';

const CartContext = createContext(null);
const STORAGE_KEY = 'edson_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [deliverySettings, setDeliverySettings] = useState({ fee: 5000, threshold: 100000 });

  useEffect(() => {
    getStoreSettings().then((settings) => setDeliverySettings({ fee: Number(settings.deliveryFee) || 5000, threshold: Number(settings.freeDeliveryThreshold) || 100000 })).catch(() => { });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock || 99) } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        if (qty <= 0) return i;
        return { ...i, qty: Math.min(qty, i.stock || 99) };
      })
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = items.length === 0 || subtotal >= deliverySettings.threshold ? 0 : deliverySettings.fee;
  const total = subtotal + delivery;

  const value = {
    items, addItem, updateQty, removeItem, clear, count, subtotal, delivery, total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};