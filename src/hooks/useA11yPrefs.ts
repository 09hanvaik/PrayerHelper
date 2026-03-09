import { useState, useEffect } from 'react';

export interface A11yPrefs {
  largeText: boolean;
  reducedMotion: boolean;
}

function readStoredPrefs(): A11yPrefs {
  try {
    const stored = localStorage.getItem('prayer_a11y');
    if (stored) return JSON.parse(stored) as A11yPrefs;
  } catch { /* private browsing or corrupt */ }

  return {
    largeText: false,
    // Respect the OS-level preference as the default
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  };
}

export function useA11yPrefs() {
  const [prefs, setPrefs] = useState<A11yPrefs>(readStoredPrefs);

  // Keep <html> classes and localStorage in sync whenever prefs change
  useEffect(() => {
    document.documentElement.classList.toggle('large-text',    prefs.largeText);
    document.documentElement.classList.toggle('reduce-motion', prefs.reducedMotion);
    try {
      localStorage.setItem('prayer_a11y', JSON.stringify(prefs));
    } catch { /* ignore */ }
  }, [prefs]);

  function toggle(key: keyof A11yPrefs) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return { prefs, toggle };
}
