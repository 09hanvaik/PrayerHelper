import { useState, useEffect, useCallback } from 'react';
import type { AppPage } from '../types/app';

const VALID_PAGES = new Set<AppPage>(['home', 'explore', 'act', 'about']);

function parseHash(): AppPage {
  const raw = window.location.hash.replace('#/', '').replace('#', '');
  return VALID_PAGES.has(raw as AppPage) ? (raw as AppPage) : 'home';
}

/**
 * Minimal hash-based router. Keeps the URL in sync with the current page
 * so browser back/forward navigation works without adding a dependency.
 *
 *   #/          → home
 *   #/explore   → explore
 *   #/act       → act
 *   #/about     → about
 */
export function useHashRoute() {
  const [page, setPageState] = useState<AppPage>(parseHash);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    function onHashChange() {
      setPageState(parseHash());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Navigate programmatically — updates hash, which triggers setPageState
  const navigate = useCallback((target: AppPage) => {
    const hash = target === 'home' ? '#/' : `#/${target}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    // Also set state directly for instant UI response (hashchange is async)
    setPageState(target);
  }, []);

  return { page, navigate };
}
