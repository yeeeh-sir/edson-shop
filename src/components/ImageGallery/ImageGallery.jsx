import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const FALLBACK = `${process.env.PUBLIC_URL}/images/fallback.svg`;

export default function ImageGallery({ images = [], name = 'Product' }) {
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);

  const list = images.length ? images : [FALLBACK];

  useEffect(() => {
    setActive(0);
    setError(false);
  }, [images]);

  const onError = () => setError(true);
  const src = error ? FALLBACK : list[active] || FALLBACK;

  const prev = () => setActive((a) => (a - 1 + list.length) % list.length);
  const next = () => setActive((a) => (a + 1) % list.length);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5">
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={onError}
          loading="eager"
        />
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImageOff size={32} />
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {list.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                i === active ? 'ring-brand-500' : 'ring-transparent hover:ring-slate-300'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}