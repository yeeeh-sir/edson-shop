import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { FALLBACK_IMAGE, getImageVariants } from '../../utils/cloudinary';

const RATIO_CLASSES = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
};

/*
 * Professional, consistent product image.
 *
 * - Uses the stored Cloudinary image (or a local /uploads URL) untouched
 *   except for f_auto / q_auto / w_* optimization when possible.
 * - Keeps a uniform aspect container so grids never collapse or reflow.
 * - Lazy-loads by default; pass `lazy={false}` for the visible hero image.
 * - Falls back to a neutral branded placeholder, and hides gracefully if
 *   even the placeholder is unavailable.
 */
export default function ProductImage({
  src,
  alt = '',
  width = 400,
  cover = true,
  ratio = 'square',
  lazy = true,
  className = '',
  imgClassName = '',
  onErrorChange = null,
}) {
  const original = typeof src === 'string' && src.trim() ? src : '';
  const [stage, setStage] = useState(original ? 'image' : 'fallback');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStage(original ? 'image' : 'fallback');
    setLoaded(false);
  }, [original]);

  const variants = original ? getImageVariants(original, width) : null;
  const mainSrc = variants ? variants.src : original;
  const srcSet = variants ? variants.srcSet : undefined;

  const ratioClass = RATIO_CLASSES[ratio] || ratio || '';
  const wrapperClass = ['relative overflow-hidden bg-cream-200', ratioClass, className].filter(Boolean).join(' ');

  const imgClass = [
    'h-full w-full transition-opacity duration-500',
    cover ? 'object-cover' : 'object-contain',
    loaded ? 'opacity-100' : 'opacity-0',
    imgClassName,
  ].filter(Boolean).join(' ');

  const handleError = () => {
    if (stage === 'image') {
      setStage('fallback');
      if (onErrorChange) onErrorChange('error');
    } else {
      setStage('hidden');
    }
  };

  return (
    <div className={wrapperClass}>
      {stage === 'hidden' ? (
        <div className="flex h-full w-full items-center justify-center text-ink-200">
          <ImageOff size={Math.round(width / 6) || 20} />
        </div>
      ) : stage === 'image' && original ? (
        <img
          src={mainSrc}
          srcSet={srcSet}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onError={handleError}
          onLoad={() => setLoaded(true)}
          className={imgClass}
        />
      ) : (
        <img
          src={FALLBACK_IMAGE}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onError={handleError}
          onLoad={() => setLoaded(true)}
          className={imgClass}
        />
      )}
    </div>
  );
}