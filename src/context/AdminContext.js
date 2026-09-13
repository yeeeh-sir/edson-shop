import React, { createContext, useContext, useEffect, useState } from 'react';
import { addProduct as createProduct, deleteProduct, getProducts, updateProduct as saveProduct } from '../services/adminApi';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminProducts, setAdminProducts] = useState([]);

  useEffect(() => {
    getProducts({ limit: 100 }).then((data) => setAdminProducts(data.products || [])).catch(() => setAdminProducts([]));
  }, []);

  const addProduct = (data) => {
    return createProduct(data).then((product) => {
      setAdminProducts((prev) => [product, ...prev]);
      return product;
    });
  };

  const updateProduct = (id, data) => {
    return saveProduct(id, data).then((product) => {
      setAdminProducts((prev) => prev.map((item) => (item.id === id ? product : item)));
      return product;
    });
  };

  const removeProduct = (id) => deleteProduct(id).then(() => setAdminProducts((prev) => prev.filter((p) => p.id !== id)));

  const value = {
    adminProducts,
    addProduct,
    updateProduct,
    removeProduct,
    productCount: adminProducts.length,
    serviceCount: adminProducts.filter((p) => p.category?.toLowerCase() === 'graphics').length,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};