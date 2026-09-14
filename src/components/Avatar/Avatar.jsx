import React, { useState } from 'react';

function initialsOf(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] || '' : parts[0][1] || '';
  return (first + last).toUpperCase();
}

function googlePictureUrl(url, size) {
  if (typeof url !== 'string' || !/lh3\.googleusercontent\.com/i.test(url)) return url;
  return url.replace(/(=s\d+)(-[a-z]+)?$/i, `=s${size}-c`);
}

export default function Avatar({ src, name = '', size = 40, className = '', ring = false }) {
  const [failed, setFailed] = useState(false);
  const image = googlePictureUrl(src, Math.round(size * 3));
  const showImage = Boolean(src && !failed);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display font-bold text-white ${
        ring ? 'ring-2 ring-brand-100' : ''
      } ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      aria-label={name ? `${name}'s avatar` : 'Profile picture'}
    >
      {showImage ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}