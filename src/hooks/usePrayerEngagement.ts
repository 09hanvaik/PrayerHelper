import { useState, useEffect, useCallback } from 'react';
import type { PrayerEngagement } from '../types/prayer';

// Maps a prayer id string to a plausible starting count in [min, max].
// Deterministic so the same prayer always seeds the same count on first visit.
function seedCount(id: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return min + (hash % (max - min + 1));
}

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // private browsing or quota exceeded
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // graceful degradation — state still works in-memory for the session
  }
}

export function usePrayerEngagement(prayerId: string): PrayerEngagement {
  const prayedKey = `prayer_prayed_${prayerId}`;
  const countKey  = `prayer_count_${prayerId}`;

  const [hasPrayed, setHasPrayed] = useState<boolean>(() => {
    return storageGet(prayedKey) === 'true';
  });

  const [count, setCount] = useState<number>(() => {
    const stored = storageGet(countKey);
    if (stored !== null) return parseInt(stored, 10);
    // First visit — seed a plausible count so it doesn't start at 0
    return seedCount(prayerId, 120, 450);
  });

  // Keep localStorage in sync whenever count changes
  useEffect(() => {
    storageSet(countKey, String(count));
  }, [count, countKey]);

  const handlePray = useCallback(() => {
    if (hasPrayed) return; // idempotent

    // TODO: replace with POST /api/prayers/:id/pray when backend exists
    setHasPrayed(true);
    setCount(prev => prev + 1);
    storageSet(prayedKey, 'true');
  }, [hasPrayed, prayedKey]);

  return { hasPrayed, count, handlePray };
}
