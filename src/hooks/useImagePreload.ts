import { useState, useEffect } from 'react';

/**
 * Preloads an image URL and returns whether it has finished loading.
 * Also injects a <link rel="preload"> for early browser discovery.
 */
export function useImagePreload(src: string | undefined): boolean {
  const [loaded, setLoaded] = useState(!src);

  useEffect(() => {
    if (!src) {
      // No image — nothing to wait for
      setLoaded(true);
      return;
    }

    // New src — reset until loaded
    setLoaded(false);

    // Inject preload link for early browser discovery
    let link: HTMLLinkElement | null = document.querySelector(`link[href="${src}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }

    // Also load via Image() for reliable onload callback
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // show scene even on error (fallback bg-color)
    img.src = src;

    // If already cached, onload fires synchronously
    if (img.complete) setLoaded(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return loaded;
}
