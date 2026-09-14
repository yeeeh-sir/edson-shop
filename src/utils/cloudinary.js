/**
 * Cloudinary helpers for the Edson Shop frontend.
 *
 * Product image URLs are stored on the server as full Cloudinary secure URLs
 * (e.g. https://res.cloudinary.com/<cloud>/image/upload/v<version>/<id>.<ext>).
 * Nothing here rebuilds URLs from scratch and no credentials are required —
 * we only derive optimized variants from existing URLs by injecting
 * transformations (f_auto, q_auto, w_*) right after `image/upload/`.
 */

export const FALLBACK_IMAGE = `${process.env.PUBLIC_URL || ''}/images/fallback.svg`;

const CLOUDINARY_URL_RE = /^https:\/\/(?:res\.)?cloudinary\.com\/([^/]+)\/image\/upload\/([^/]+(?:\/[^/]+)*)$/i;

const hasTransform = (segment) => segment.includes('_') && !/^v\d+$/i.test(segment);

/**
 * Returns the input URL with an optimized Cloudinary variant applied, or the
 * original URL unchanged when the input is not a Cloudinary upload URL.
 *
 * @param {string} url
 * @param {number} width  Requested width in px (must be finite, > 0).
 * @returns {string}
 */
export function cloudinaryVariant(url, width) {
  if (typeof url !== 'string' || !url.trim()) return url;
  const match = CLOUDINARY_URL_RE.exec(url.trim());
  if (!match) return url;

  const [, cloud, remainder] = match;
  const w = typeof width === 'number' && Number.isFinite(width) && width > 0
    ? Math.round(width)
    : null;

  const transform = ['f_auto', 'q_auto', w ? `w_${w}` : null]
    .filter(Boolean)
    .join(',');

  let rest = remainder;
  const slash = remainder.indexOf('/');
  const firstSegment = slash === -1 ? remainder : remainder.slice(0, slash);
  if (hasTransform(firstSegment)) {
    rest = remainder.slice(slash + 1);
  }

  return `https://res.cloudinary.com/${cloud}/image/upload/${transform}/${rest}`;
}

/**
 * Derives 1x/2x variants for an image, suitable for a srcSet.
 * Returns `null` when the URL cannot be optimized.
 *
 * @param {string} url
 * @param {number} width
 * @returns {{ src: string, srcSet: string, retina: string } | null}
 */
export function getImageVariants(url, width) {
  if (typeof url !== 'string' || !url.trim()) return null;
  const src = cloudinaryVariant(url, width);
  if (src === url) return null;
  const retina = cloudinaryVariant(url, width * 2);
  return { src, retina, srcSet: `${src} 1x, ${retina} 2x` };
}