/**
 * Liturgical Calendar — local computation
 *
 * Implements the full Roman Catholic calendar based on the
 * Meeus/Jones/Butcher Easter algorithm. No network required.
 *
 * Seasons: Advent → Christmas → Ordinary Time (early) → Lent →
 *          Holy Week → Easter → Pentecost → Ordinary Time (late) → Advent
 */

import type { LiturgicalSeason } from '../types/prayer';

// ── Easter algorithm (Meeus / Jones / Butcher, Gregorian) ──────────────────

export function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-indexed
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// ── Date helpers ────────────────────────────────────────────────────────────

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// UTC midnight timestamp — makes date comparisons timezone-safe
function midnight(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

function diffDays(a: Date, b: Date): number {
  return Math.round((midnight(a) - midnight(b)) / 86_400_000);
}

// First Sunday of Advent = Sunday nearest to November 30
//   Nov 30 Mon/Tue/Wed → go back to previous Sunday
//   Nov 30 Thu/Fri/Sat → go forward to next Sunday
//   Nov 30 Sun → that Sunday
function adventSunday(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const dow   = nov30.getDay(); // 0 = Sunday
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}

// ── Ordinal labels ──────────────────────────────────────────────────────────

const ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];
function ord(n: number): string {
  return ORD[n - 1] ?? `${n}th`;
}

// ── Public types ────────────────────────────────────────────────────────────

export interface LiturgicalDay {
  season:     LiturgicalSeason;
  weekNumber: number;
  weekLabel:  string;   // e.g. "Third Sunday of Lent"
  colour:     'purple' | 'green' | 'white' | 'red';
}

// ── Main function ───────────────────────────────────────────────────────────

export function getLiturgicalDay(today: Date = new Date()): LiturgicalDay {
  const year    = today.getFullYear();
  const todayMs = midnight(today);

  const gte = (d: Date) => todayMs >= midnight(d);
  const lt  = (d: Date) => todayMs <  midnight(d);
  const on  = (d: Date) => todayMs === midnight(d);

  const isSunday = today.getDay() === 0;

  // ── Key dates ────────────────────────────────────────────────────────────

  const easter    = computeEaster(year);
  const ashWed    = addDays(easter, -46); // 46 days before Easter
  const palmSun   = addDays(easter, -7);  // Palm Sunday
  const pentecost = addDays(easter,  49); // 7 weeks after Easter

  const christmas     = new Date(year,     11, 25);
  const christmasPrev = new Date(year - 1, 11, 25);
  const epiphany      = new Date(year,      0,  6); // Jan 6
  const epiphanyNext  = new Date(year + 1,  0,  6);

  const advent = adventSunday(year);

  // ── Holy Week: Palm Sunday → Holy Saturday (inclusive) ───────────────────
  // Uses lt(easter) so Holy Thursday, Good Friday, and Holy Saturday are
  // correctly kept in the Holy Week block rather than falling to Ordinary Time.
  if (gte(palmSun) && lt(easter)) {
    return { season: 'lent', weekNumber: 6, weekLabel: 'Holy Week', colour: 'purple' };
  }

  // ── Lent: Ash Wednesday → Palm Sunday ────────────────────────────────────
  if (gte(ashWed) && lt(palmSun)) {
    const days = diffDays(today, ashWed);
    const n    = Math.min(Math.floor(days / 7) + 1, 5);
    return {
      season:     'lent',
      weekNumber: n,
      weekLabel:  isSunday ? `${ord(n)} Sunday of Lent` : `${ord(n)} Week of Lent`,
      colour:     'purple',
    };
  }

  // ── Easter Season: Easter Sunday → Pentecost ─────────────────────────────
  if (gte(easter) && todayMs <= midnight(pentecost)) {
    if (on(pentecost)) {
      return { season: 'easter', weekNumber: 7, weekLabel: 'Pentecost Sunday', colour: 'red' };
    }
    const n = Math.floor(diffDays(today, easter) / 7) + 1;
    return {
      season:     'easter',
      weekNumber: n,
      weekLabel:  isSunday ? `${ord(n)} Sunday of Easter` : `${ord(n)} Week of Easter`,
      colour:     'white',
    };
  }

  // ── Advent: 1st Advent Sunday → Christmas Eve ────────────────────────────
  if (gte(advent) && lt(christmas)) {
    const n = Math.min(Math.floor(diffDays(today, advent) / 7) + 1, 4);
    return {
      season:     'advent',
      weekNumber: n,
      weekLabel:  isSunday ? `${ord(n)} Sunday of Advent` : `${ord(n)} Week of Advent`,
      colour:     'purple',
    };
  }

  // ── Christmas Season: Dec 25 – Jan 5 ────────────────────────────────────
  const inChristmas =
    (gte(christmas)     && lt(epiphanyNext)) ||
    (gte(christmasPrev) && lt(epiphany));
  if (inChristmas) {
    return { season: 'ordinary', weekNumber: 1, weekLabel: 'Christmas Season', colour: 'white' };
  }

  // ── Ordinary Time ────────────────────────────────────────────────────────
  // Early OT: Epiphany (Jan 6) → Ash Wednesday
  // Late OT:  Day after Pentecost → 1st Advent Sunday
  const ordStart   = todayMs < midnight(ashWed) ? epiphany : addDays(pentecost, 1);
  const ordWeekNum = Math.max(2, Math.floor(diffDays(today, ordStart) / 7) + 2);
  return {
    season:     'ordinary',
    weekNumber: ordWeekNum,
    weekLabel:  isSunday
      ? `${ord(ordWeekNum)} Sunday in Ordinary Time`
      : `Week ${ordWeekNum} in Ordinary Time`,
    colour:     'green',
  };
}
