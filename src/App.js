import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Favorites from './pages/Favorites/Favorites';
import Graphics from './pages/Graphics/Graphics';
import CustomDesign from './pages/CustomDesign/CustomDesign';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import ProductForm from './admin/ProductForm';
import AdminCategories from './admin/Categories';
import AdminOrders from './admin/Orders';
import AdminCustomers from './admin/Customers';
import AdminGraphics from './admin/Graphics';
import AdminSettings from './admin/Settings';
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import AdminProfile from './admin/pages/AdminProfile';
import GoogleLogin from './public/pages/GoogleLogin';
import CustomerGuard from './public/components/CustomerGuard';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Orders/Orders';
import CustomerDashboard from './pages/Dashboard/Dashboard';
import Payments from './pages/Payments/Payments';
import OrderDetails from './pages/OrderDetails/OrderDetails';

function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<GoogleLogin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/graphics" element={<Graphics />} />
          <Route path="/graphics/request" element={<CustomDesign />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<StoreLayout />}>
          <Route element={<CustomerGuard />}>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-orders" element={<Orders />} />
            <Route path="/my-orders/:id" element={<OrderDetails />} />
            <Route path="/my-payments" element={<Payments />} />
          </Route>
        </Route>

        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="graphics" element={<AdminGraphics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}