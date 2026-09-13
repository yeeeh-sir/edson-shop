import React, { useRef, useState } from 'react';
import { UploadCloud, X, Check, Star } from 'lucide-react';

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        file,
        src: reader.result,
      });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images = [],
  onAdd,
  onRemove,
  onSetPrimary,
  multiple = true,
  max = 5,
  label = 'Upload images',
  hint = 'PNG, JPG or WEBP. Uploaded securely via the backend image service.',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files) => {
    const picked = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!picked.length) return;
    setBusy(true);
    const remaining = Math.max(0, max - images.length);
    const mapped = await Promise.all(picked.slice(0, remaining).map(readFile));
    setBusy(false);
    if (mapped.length && onAdd) onAdd(mapped);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/50'
          }`}
      >
        {busy ? (
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-600 border-t-transparent" />
        ) : (
          <UploadCloud size={32} className="text-brand-500" />
        )}
        <p className="text-sm font-semibold text-slate-700">Drag & drop images here</p>
        <p className="text-xs text-slate-400">or click to browse · up to {max} images</p>
        <span className="mt-1 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-brand-600 shadow-sm ring-1 ring-brand-100">
          Choose files
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <p className="mt-2 text-xs text-slate-400">{hint}</p>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-slate-200">
              <img src={img.src} alt={img.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-900/70 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onSetPrimary && onSetPrimary(img.id)}
                  className="rounded-md bg-white/90 p-1 text-slate-700 transition hover:bg-white"
                  title="Set as main image"
                  aria-label="Set as main image"
                >
                  <Star size={14} className={img.primary ? 'fill-accent-500 text-accent-500' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove && onRemove(img.id)}
                  className="rounded-md bg-white/90 p-1 text-rose-600 transition hover:bg-white"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
              {img.primary && (
                <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  <Check size={11} /> MAIN
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}