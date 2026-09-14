import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import ProductImage from '../ProductImage/ProductImage';

export default function ImageGallery({ images = [], name = 'Product' }) {
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);

  const list = (images || []).filter(Boolean).length ? images.filter(Boolean) : [];

  useEffect(() => {
    setActive(0);
    setError(false);
  }, [images]);

  const shown = list.filter(Boolean);
  const src = (shown.length ? shown[active % shown.length] : '') || '';

  const prev = () => setActive((a) => (a - 1 + shown.length) % shown.length);
  const next = () => setActive((a) => (a + 1) % shown.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-900/5">
        <ProductImage
          src={src}
          alt={name}
          width={900}
          ratio="square"
          cover
          lazy={false}
          onErrorChange={(t) => setError(t === 'error')}
        />
        {shown.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImageOff size={32} />
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}
      </div>
      {shown.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {shown.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                i === active ? 'ring-brand-500' : 'ring-transparent hover:ring-slate-300'
              }`}
            >
              <ProductImage
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                width={160}
                ratio="square"
                cover
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}