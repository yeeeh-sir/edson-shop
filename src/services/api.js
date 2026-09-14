/*
  Edison Shop - API client

  Architecture: React + Tailwind -> Node.js/Express REST API -> MySQL

  The Express API lives in the sibling `edson-backend/` project. All functions
  below call the REST API.

  The backend base URL is configured through the centralized
  `REACT_APP_API_URL` environment variable (see .env.local / .env.production).
  It may be set with or without the `/api` prefix - the `resolveApiUrl`
  helper below always appends it (e.g. https://host.example OR
  https://host.example/api both become https://host.example/api).
  When the variable is not set, it falls back to the local dev server.

  All catalogue, order, customer, and dashboard data comes from the API.

  Auth tokens are stored in localStorage under `edson_token` and sent as
  `Authorization: Bearer <token>` (the backend also sets an httpOnly cookie).
*/

function resolveApiUrl() {
  const raw = (process.env.REACT_APP_API_URL || 'http://localhost:5000').trim();
  const base = raw.replace(/\/+$/, '');
  return /\/api$/.test(base) ? base : `${base}/api`;
}

const API_URL = resolveApiUrl();
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const TOKEN_KEY = 'edson_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token || '');
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/* ---------- Low-level HTTP helper ---------- */

function fallbackMessage(status, method, path) {
  if (status === 404) return `API route not found: ${method} ${path}. Check REACT_APP_API_URL points to the API root.`;
  if (status === 401) return 'Invalid email or password or authentication required';
  if (status === 403) return 'You do not have permission to perform this action';
  if (status === 400) return 'Invalid request. Please check your input.';
  if (status === 502 || status === 503 || status === 504) return 'The server is temporarily unavailable. Please try again later.';
  if (status >= 500) return 'Server error. Please try again later.';
  return `Request failed (${status})`;
}

async function request(method, path, body) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers, credentials: 'include' };
  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (_netErr) {
    const error = new Error('Unable to connect to the server');
    error.status = 0;
    error.data = { success: false, message: 'Unable to connect to the server' };
    error.path = path;
    throw error;
  }
  let data = null;
  try {
    data = await response.json();
  } catch (_err) {
    data = { success: false, message: 'Invalid response from server' };
  }

  if (!response.ok || data.success === false) {
    const serverMessage = data && data.message;
    const isGeneric = !serverMessage || /something went wrong|invalid response from server|route not found|unable to connect/i.test(serverMessage);
    const message = isGeneric ? fallbackMessage(response.status, method, path) : serverMessage;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    error.path = path;
    throw error;
  }

  return data;
}

/* ---------- Multipart upload helper (backend validates + uploads to Cloudinary) ---------- */

async function uploadFile(path, field, file, extra = {}) {
  const formData = new FormData();
  formData.append(field, file);
  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
  } catch (_netErr) {
    const error = new Error('Unable to connect to the server');
    error.status = 0;
    error.data = { success: false, message: 'Unable to connect to the server' };
    throw error;
  }
  let data;
  try {
    data = await response.json();
  } catch (_err) {
    data = { success: false, message: 'Invalid response from server' };
  }
  if (!response.ok || data.success === false) {
    const error = new Error(data.message && !/something went wrong|invalid response from server|route not found/i.test(data.message) ? data.message : `Upload failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const formatPrice = (value) =>
  new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const normalizeProduct = (product) => {
  if (!product) return product;
  const resolveImageUrl = (value) => {
    if (!value) return '';
    if (/^(https?:|data:|blob:)/i.test(value)) return value;
    return `${API_ORIGIN}/${String(value).replace(/^\/+/, '')}`;
  };
  const images = Array.isArray(product.images)
    ? product.images.map((item) => resolveImageUrl(typeof item === 'string' ? item : item.image_url)).filter(Boolean)
    : [];
  const image = resolveImageUrl(product.image || product.main_image) || images[0] || '';
  return {
    ...product,
    category: product.category || product.category_slug,
    categoryName: product.categoryName || product.category_name,
    subcategory: product.subcategory || product.subcategory_name,
    oldPrice: product.oldPrice ?? product.old_price ?? null,
    reviews: product.reviews ?? product.reviews_count ?? 0,
    featured: product.featured ?? Boolean(product.is_featured),
    popular: product.popular ?? Boolean(product.is_popular),
    isNew: product.isNew ?? false,
    isService: product.isService ?? product.category_slug === 'graphics',
    image,
    images: images.length ? images : image ? [image] : [],
  };
};

/* ---------- Auth + Profile ---------- */

export async function register({ full_name, email, phone, password }) {
  const res = await request('POST', '/auth/register', { full_name, email, phone, password });
  setToken(res.data.token);
  return res.data.user;
}

export async function login(email, password) {
  const res = await request('POST', '/auth/login', { email, password });
  setToken(res.data.token);
  return res.data.user;
}

export async function googleLogin(credential) {
  const res = await request('POST', '/auth/google', { credential });
  if (!res.data || !res.data.token) {
    throw new Error('Google login did not return an authentication token. Please try again.');
  }
  setToken(res.data.token);
  return res.data.user;
}

export async function logout() {
  clearToken();
  try {
    await request('POST', '/auth/logout');
  } catch (_err) {
    /* ignore, local token is already cleared */
  }
}

export async function getCurrentUser() {
  const res = await request('GET', '/auth/me');
  return res.data.user;
}

export async function updateProfile(fields) {
  const res = await request('PUT', '/users/me', fields);
  return res.data.user;
}

export async function changePassword(current_password, new_password) {
  await request('PUT', '/users/me/password', { current_password, new_password });
}

export async function uploadProfileImage(file) {
  const res = await uploadFile('/users/me/profile-image', 'profile_image', file);
  return res.data.user;
}

/* ---------- Catalog ---------- */

const toApiSort = (sort) =>
  ({
    'price-asc': 'price_low',
    'price-desc': 'price_high',
    newest: 'newest',
    rating: 'rating',
  })[sort] || 'popular';

export async function getCategories() {
  const res = await request('GET', '/categories');
  return res.data.categories;
}

export async function getCategory(slug) {
  const res = await request('GET', `/categories/${encodeURIComponent(slug)}`);
  return res.data.category;
}

export async function getAdminCategories() {
  const res = await request('GET', '/admin/categories');
  return res.data.categories;
}

export async function addCategory(payload) {
  const res = await request('POST', '/admin/categories', payload);
  return res.data.category;
}

export async function deleteCategory(id) {
  return request('DELETE', `/admin/categories/${id}`);
}

export async function updateCategoryStatus(id, status) {
  const res = await request('PATCH', `/admin/categories/${id}/status`, { status });
  return res.data.category;
}

export async function getProducts({
  page = 1,
  limit = 24,
  search,
  category,
  subcategory,
  minPrice,
  maxPrice,
  sort,
  featured,
  popular,
} = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (category && category !== 'all') params.set('category', category);
  if (subcategory && subcategory !== 'all') params.set('subcategory', subcategory);
  if (minPrice !== undefined && minPrice !== null) params.set('minPrice', minPrice);
  if (maxPrice !== undefined && maxPrice !== null) params.set('maxPrice', maxPrice);
  if (sort) params.set('sort', toApiSort(sort));
  if (featured) params.set('featured', '1');
  if (popular) params.set('popular', '1');

  const res = await request('GET', `/products?${params.toString()}`);
  return { ...res.data, products: (res.data.products || []).map(normalizeProduct) };
}

export async function getProduct(id) {
  const res = await request('GET', `/products/${id}`);
  return normalizeProduct(res.data.product);
}

export async function searchProducts(query) {
  const res = await request('GET', `/products/search?q=${encodeURIComponent(query)}`);
  return res.data.products.map(normalizeProduct);
}

export async function getFeaturedProducts() {
  const res = await request('GET', '/products/featured');
  return res.data.products.map(normalizeProduct);
}

export async function getPopularProducts() {
  const res = await request('GET', '/products/popular');
  return res.data.products.map(normalizeProduct);
}

export async function getReviews(productId) {
  const res = await request('GET', `/products/${productId}/reviews`);
  return res.data;
}

export async function createReview(productId, { rating, review = '' } = {}) {
  const res = await request('POST', `/products/${productId}/reviews`, { rating, review });
  return res;
}

/* ---------- Cart (authenticated) ---------- */

export async function getCart() {
  const res = await request('GET', '/cart');
  return res.data;
}

export async function addToCart(productId, quantity = 1) {
  const res = await request('POST', '/cart', { product_id: productId, quantity });
  return res.data;
}

export async function updateCartItem(itemId, quantity) {
  const res = await request('PUT', `/cart/${itemId}`, { quantity });
  return res.data;
}

export async function removeFromCart(itemId) {
  const res = await request('DELETE', `/cart/${itemId}`);
  return res.data;
}

export async function clearCart() {
  const res = await request('DELETE', '/cart');
  return res.data;
}

/* ---------- Wishlist (authenticated) ---------- */

export async function getWishlist() {
  const res = await request('GET', '/wishlist');
  return res.data;
}

export async function addToWishlist(productId) {
  const res = await request('POST', `/wishlist/${productId}`);
  return res.data;
}

export async function removeFromWishlist(productId) {
  const res = await request('DELETE', `/wishlist/${productId}`);
  return res.data;
}

/* ---------- Orders (authenticated) ---------- */

export async function createOrder({ items, full_name, phone, email, address, city, country, notes }) {
  const res = await request('POST', '/orders', {
    items,
    full_name,
    phone,
    email,
    address,
    city,
    country,
    notes,
    clear_cart: true,
  });
  return res.data.order;
}

export async function getOrders(page = 1, limit = 20) {
  const res = await request('GET', `/orders?page=${page}&limit=${limit}`);
  return res.data;
}

export async function getOrder(id) {
  const res = await request('GET', `/orders/${id}`);
  return res.data.order;
}

export async function submitPayment({ items, customer, payment_method, payment_number, transaction_reference, customer_note, screenshot }) {
  const formData = new FormData();
  formData.append('items', JSON.stringify(items));
  Object.entries(customer).forEach(([key, value]) => formData.append(key, value || ''));
  formData.append('payment_method', payment_method || 'mobile_money');
  formData.append('payment_number', payment_number || '');
  formData.append('transaction_reference', transaction_reference || '');
  formData.append('customer_note', customer_note || '');
  formData.append('screenshot', screenshot);
  const token = getToken();
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}/payments/submit`, { method: 'POST', headers, credentials: 'include', body: formData });
  const data = await response.json();
  if (!response.ok || data.success === false) throw new Error(data.message || 'Payment confirmation failed');
  return data.data.payment;
}

export async function getMyPayments() {
  const res = await request('GET', '/payments/my-payments');
  return { ...res.data, payments: (res.data.payments || []).map(normalizePayment) };
}

const normalizePayment = (payment) => ({
  ...payment,
  screenshot_url: payment?.screenshot_url?.startsWith('/api/')
    ? `${API_URL.replace(/\/$/, '')}${payment.screenshot_url.replace(/^\/api/, '')}`
    : payment?.screenshot_url,
});

export async function getAdminPayments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await request('GET', `/admin/payments${query ? `?${query}` : ''}`);
  return { ...res.data, payments: (res.data.payments || []).map(normalizePayment) };
}

export async function approvePayment(id, admin_note = '') {
  const res = await request('PATCH', `/admin/payments/${id}/approve`, { admin_note });
  return res.data.payment;
}

export async function rejectPayment(id, admin_note) {
  const res = await request('PATCH', `/admin/payments/${id}/reject`, { admin_note });
  return res.data.payment;
}

export async function deletePayment(id) {
  const res = await request('DELETE', `/admin/payments/${id}`);
  return res.data;
}

/* ---------- Graphics ---------- */

export async function getGraphicsServices() {
  const res = await request('GET', '/graphics');
  return res.data.services;
}

export async function getGraphicsService(id) {
  const res = await request('GET', `/graphics/${id}`);
  return res.data.service;
}

export async function getBanners({ active = false } = {}) {
  const query = active ? '?active=1' : '';
  const res = await request('GET', `/banners${query}`);
  return res.data.banners || [];
}

export async function createGraphicsRequest({ fields = {}, file }) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  if (file) formData.append('reference_image', file);

  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}/graphics/requests`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });
  } catch (_netErr) {
    const error = new Error('Unable to connect to the server');
    error.status = 0;
    error.data = { success: false, message: 'Unable to connect to the server' };
    throw error;
  }
  const data = await response.json().catch(() => ({ success: false, message: 'Invalid response from server' }));
  if (!response.ok || data.success === false) {
    const error = new Error(data.message && !/something went wrong|invalid response from server|route not found/i.test(data.message) ? data.message : `Design request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

/* ---------- Graphics - Admin ---------- */

export async function getAdminGraphicsRequests() {
  const res = await request('GET', '/graphics/requests');
  return res.data.requests || [];
}

export async function updateGraphicsRequestStatus(id, status) {
  const res = await request('PATCH', `/graphics/requests/${id}/status`, { status });
  return res.data.request;
}

/* ---------- Contact ---------- */

export async function sendContactMessage(payload) {
  const res = await request('POST', '/contact', payload);
  return res;
}

/* ---------- Admin ---------- */

export async function getAdminDashboard() {
  const res = await request('GET', '/admin/dashboard');
  return res.data;
}

export async function getStoreSettings() {
  const res = await request('GET', '/settings');
  return res.data.settings;
}

export async function updateStoreSettings(settings) {
  const res = await request('PUT', '/settings', settings);
  return res.data.settings;
}

export async function getAdminProfile() {
  const res = await request('GET', '/admin/profile');
  return res.data.profile;
}

export async function updateAdminEmail(data) {
  const res = await request('PUT', '/admin/profile/email', data);
  return res;
}

export async function updateAdminPassword(data) {
  const res = await request('PUT', '/admin/profile/password', data);
  return res;
}

export async function addProduct(payload) {
  const res = await request('POST', '/products', payload);
  return res.data.product;
}

export async function uploadProductImages(productId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/products/${productId}/images`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || `Image upload failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data.data.product;
}

export async function uploadCategoryImage(categoryId, file) {
  const res = await uploadFile(`/admin/categories/${categoryId}/image`, 'image', file);
  return res.data.category;
}

export async function createBanner(payload) {
  const res = await request('POST', '/admin/banners', payload);
  return res.data.banner;
}

export async function updateBanner(id, payload) {
  const res = await request('PUT', `/admin/banners/${id}`, payload);
  return res.data.banner;
}

export async function deleteBanner(id) {
  return request('DELETE', `/admin/banners/${id}`);
}

export async function uploadBannerImage(bannerId, file) {
  const res = await uploadFile(`/admin/banners/${bannerId}/image`, 'image', file);
  return res.data.banner;
}

export async function updateProduct(id, payload) {
  const res = await request('PUT', `/products/${id}`, payload);
  return res.data.product;
}

export async function deleteProduct(id) {
  const res = await request('DELETE', `/products/${id}`);
  return res.data;
}

export async function getAdminUsers({ search, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  const res = await request('GET', `/admin/users?${params.toString()}`);
  return res.data;
}

export async function deleteUser(id) {
  return request('DELETE', `/admin/users/${id}`);
}

export const api = {
  getCategories,

  async fetchProducts({
    query,
    category,
    subcategory,
    priceMax,
    minRating,
    inStockOnly,
    sort,
  } = {}) {
    const data = await getProducts({
      limit: 100,
      search: query,
      category,
      subcategory,
      maxPrice: priceMax,
      sort,
    });
    let list = data.products;
    if (minRating) list = list.filter((p) => Number(p.rating) >= Number(minRating));
    if (inStockOnly) list = list.filter((p) => Number(p.stock) > 0);
    return list;
  },

  async fetchProduct(id) {
    return getProduct(id);
  },

  async fetchCategoryProducts(slug) {
    const data = await getProducts({ category: slug, limit: 100 });
    return data.products;
  },

  async fetchRelated(product, limit = 4) {
    if (!product) return [];
    const data = await getProducts({ category: product.category_slug || product.category, limit });
    return data.products.filter((p) => String(p.id) !== String(product.id)).slice(0, limit);
  },

  async search(query) {
    return searchProducts(query);
  },

  async placeOrder(payload) {
    try {
      const order = await createOrder({
        items: (payload.items || payload.products || []).map((it) => ({
          product_id: Number(it.id || it.product_id),
          quantity: Number(it.qty || it.quantity || 1),
        })),
        full_name: payload.full_name || payload.name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        city: payload.city,
        country: payload.country,
        notes: payload.notes,
      });
      return {
        success: true,
        orderId: order.order_number,
        message: 'Order received! Thank you for shopping with Edison.',
      };
    } catch (err) {
      return { success: false, orderId: null, message: err.message };
    }
  },

  async requestDesign(payload) {
    try {
      const images = Array.isArray(payload.images) ? payload.images : [];
      const reference = images.find((i) => i.primary) || images[0] || null;
      await createGraphicsRequest({
        fields: {
          customer_name: payload.fullName || '',
          phone: payload.phone || '',
          email: payload.email || '',
          design_type: payload.designType || '',
          size: payload.size || '',
          quantity: payload.quantity || '',
          description: payload.description || '',
        },
        file: reference && reference.file ? reference.file : null,
      });
      return {
        success: true,
        requestId: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
        message: 'Design request received! Our studio will contact you shortly.',
      };
    } catch (err) {
      return { success: false, requestId: null, message: err.message };
    }
  },
};

export default api;