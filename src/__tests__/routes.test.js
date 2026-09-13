import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';

const renderAt = (entry) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <FavoritesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoritesProvider>
    </MemoryRouter>
  );

const h1 = (name) => screen.getAllByRole('heading', { level: 1, name }).length;

describe('app routes', () => {
  it('renders the shop page', async () => {
    renderAt('/shop');
    expect(await screen.findByLabelText('Search in shop')).toBeTruthy();
    expect(h1('All Products')).toBe(1);
  });

  it('renders a category page', () => {
    renderAt('/shop/graphics');
    expect(h1('Graphics')).toBe(1);
  });

  it('renders a product details page', async () => {
    renderAt('/product/el-01');
    expect(await screen.findByRole('heading', { level: 1, name: 'Wireless Headphones' })).toBeTruthy();
    expect(screen.getAllByText(/Add to Cart/).length).toBeGreaterThan(0);
  });

  it('renders a graphics service page with customization options', async () => {
    renderAt('/product/gr-01');
    expect(await screen.findByRole('heading', { level: 1, name: 'Custom Banner Design' })).toBeTruthy();
    expect(screen.getAllByText('Design your order').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Request Custom Design').length).toBeGreaterThan(0);
  });

  it('renders an unknown product gracefully', async () => {
    renderAt('/product/does-not-exist');
    expect(await screen.findByText('Product not found')).toBeTruthy();
  });

  it('renders the cart page', () => {
    renderAt('/cart');
    expect(h1('Shopping Cart')).toBe(1);
  });

  it('renders the favorites page', () => {
    renderAt('/favorites');
    expect(h1('My Favorites')).toBe(1);
  });

  it('renders the graphics page', () => {
    renderAt('/graphics');
    expect(h1(/Your Vision/)).toBe(1);
  });

  it('renders the custom design request page', () => {
    renderAt('/graphics/request');
    expect(h1('Request Custom Design')).toBe(1);
  });

  it('renders the about page', () => {
    renderAt('/about');
    expect(h1(/Every Shop You Need/)).toBe(1);
  });

  it('renders the contact page', () => {
    renderAt('/contact');
    expect(h1('Contact Us')).toBe(1);
  });

  it('renders the admin dashboard', () => {
    renderAt('/admin');
    expect(h1('Dashboard')).toBe(1);
    expect(screen.getAllByText('Total Products').length).toBeGreaterThan(0);
  });

  it('renders the admin products page', () => {
    renderAt('/admin/products');
    expect(h1('Products')).toBe(1);
  });

  it('renders the admin product add form', () => {
    renderAt('/admin/products/add');
    expect(h1('Add new product')).toBe(1);
  });

  it('renders the admin product edit form', () => {
    renderAt('/admin/products/edit/el-01');
    expect(h1('Edit product')).toBe(1);
  });

  it('renders the admin categories page', () => {
    renderAt('/admin/categories');
    expect(h1('Categories')).toBe(1);
  });

  it('renders the admin orders page', () => {
    renderAt('/admin/orders');
    expect(h1('Orders')).toBe(1);
  });

  it('renders the admin customers page', () => {
    renderAt('/admin/customers');
    expect(h1('Customers')).toBe(1);
  });

  it('renders the admin graphics page', () => {
    renderAt('/admin/graphics');
    expect(h1('Graphics Studio')).toBe(1);
  });

  it('renders the admin settings page', () => {
    renderAt('/admin/settings');
    expect(h1('Store settings')).toBe(1);
  });

  it('renders a 404 page for unknown routes', () => {
    renderAt('/does-not-exist');
    expect(h1('This page wandered off')).toBe(1);
  });
});