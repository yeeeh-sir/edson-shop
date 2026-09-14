const PUBLIC_URL = process.env.PUBLIC_URL || '';

const fallbacks = {
  electronics: `${PUBLIC_URL}/images/categories/electronics.jpg`,
  stationery: `${PUBLIC_URL}/images/categories/stationery.jpg`,
  graphics:    `${PUBLIC_URL}/images/categories/graphics.jpg`,
  others:      `${PUBLIC_URL}/images/categories/others.jpg`,
};

const DEFAULT_IMAGE = `${PUBLIC_URL}/images/categories/default.jpg`;

/**
 * Returns the best available image for a category.
 * Admin-uploaded images take priority over local defaults.
 */
export function getCategoryImage(category) {
  if (category?.image && !category.image.startsWith('http://localhost')) return category.image;
  const key = (category?.slug || category?.name || '').toLowerCase();
  return fallbacks[key] || DEFAULT_IMAGE;
}

export default getCategoryImage;