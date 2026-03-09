export type LiturgicalSeason = 'lent' | 'advent' | 'easter' | 'ordinary';

export interface Prayer {
  id: string;
  title: string;
  text: string;          // \n\n = paragraph break, \n = line break within verse
  scripture?: string;    // Companion verse, shown after the prayer text
  reflection?: string;   // Single contemplative question or thought
  attribution?: string;
  source?: string;
  season?: LiturgicalSeason;
  date?: string;         // ISO 8601 — for editorial scheduling
}

export interface PrayerEngagement {
  hasPrayed: boolean;
  count: number;
  handlePray: () => void;
}
