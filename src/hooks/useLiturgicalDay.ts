/**
 * useLiturgicalDay
 *
 * Strategy:
 *   1. Compute today's liturgical day locally (instant, no network).
 *   2. Try the litcal.johnromanodorazio.com Church Calendar API in the
 *      background to enrich the weekLabel with the official celebration name
 *      (e.g. "Third Sunday of Lent" or "Feast of Saint Joseph").
 *   3. Cache today's API entries in sessionStorage so subsequent renders
 *      within the same session avoid a repeat fetch.
 *   4. If the API is unreachable or returns unexpected data, the local
 *      result is kept — the app never depends on the network.
 *
 * Note: calapi.inadiutorium.cz (the other common option) was unreachable
 * at build time. litcal.johnromanodorazio.com is used instead.
 */

import { useState, useEffect } from 'react';
import { getLiturgicalDay } from '../utils/liturgicalCalendar';
import type { LiturgicalDay } from '../utils/liturgicalCalendar';

// ── litcal API types ─────────────────────────────────────────────────────────

interface LitCalEntry {
  event_key: string;
  name:      string;          // Celebration name (may be in Latin without locale param)
  grade:     number;          // 1 = Solemnity (highest), 7 = weekday (lowest)
  color:     string[];        // e.g. ["purple"]
  date:      string;          // ISO 8601 e.g. "2026-03-08T00:00:00+00:00"
  liturgical_season: string;  // e.g. "LENT", "ADVENT", "ORDINARY_TIME"
  psalter_week: number;
}

interface LitCalResponse {
  litcal: LitCalEntry[];
}

// litcal season → our season map
const SEASON_MAP: Record<string, LiturgicalDay['season']> = {
  ADVENT:        'advent',
  CHRISTMAS:     'ordinary', // map Christmas to ordinary (closest type we have)
  ORDINARY_TIME: 'ordinary',
  LENT:          'lent',
  EASTER_TIME:   'easter',
};

// English season labels (litcal API names are often in Latin without a locale param)
const SEASON_LABEL: Record<string, string> = {
  LENT:          'Lent',
  ADVENT:        'Advent',
  CHRISTMAS:     'Christmas',
  EASTER_TIME:   'Eastertide',
  ORDINARY_TIME: 'Ordinary Time',
};

// Grades we consider "notable" enough to display as the week label
// 1=Solemnity, 2=Feast, 3=Obligatory Memorial, 4=Optional Memorial, 6=Sunday, 7=Weekday
const NOTABLE_GRADE = 4;

function toDatePrefix(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function fetchTodayEntries(today: Date): Promise<LitCalEntry[]> {
  const prefix  = toDatePrefix(today);
  const cacheKey = `litcal_day_${prefix}`;

  // Return cached entries if available
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached) as LitCalEntry[];

  const year = today.getFullYear();
  const res  = await fetch(
    `https://litcal.johnromanodorazio.com/api/dev/calendar/${year}`,
    { signal: AbortSignal.timeout(6000) }, // 6s timeout
  );
  if (!res.ok) throw new Error(`litcal ${res.status}`);

  const data = (await res.json()) as LitCalResponse;

  // Filter to today's entries and cache only those (not the full year)
  const todayEntries = data.litcal.filter(e => e.date.startsWith(prefix));
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(todayEntries));
  } catch { /* sessionStorage quota exceeded — fine, just don't cache */ }

  return todayEntries;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useLiturgicalDay(): LiturgicalDay {
  // Phase 1 — instant local result (no loading state needed in UI)
  const [dayData, setDayData] = useState<LiturgicalDay>(() => getLiturgicalDay());

  useEffect(() => {
    const today = new Date();

    fetchTodayEntries(today)
      .then(entries => {
        if (entries.length === 0) return;

        // Pick the highest-ranking celebration (lowest grade number = highest rank)
        const top = entries.sort((a, b) => a.grade - b.grade)[0];

        // Only override weekLabel if the celebration is notable (grade ≤ NOTABLE_GRADE)
        // or if it's a Sunday/season entry (grade 6)
        const isNotable = top.grade <= NOTABLE_GRADE || top.grade === 6;

        // Map API season (may differ slightly from local computation for edge days)
        const apiSeason = SEASON_MAP[top.liturgical_season] ?? dayData.season;

        setDayData(prev => {
          // Three-way priority: English API name → season label (Latin fallback) → local label
          let weekLabel = prev.weekLabel;
          if (isNotable) {
            weekLabel = top.name.includes(',')
              ? (SEASON_LABEL[top.liturgical_season] ?? prev.weekLabel)
              : top.name;
          }
          return { ...prev, season: apiSeason, weekLabel };
        });
      })
      .catch(() => {
        // Network unavailable or API error — local result stays, no user impact
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dayData;
}
