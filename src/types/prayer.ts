export type LiturgicalSeason = 'lent' | 'advent' | 'easter' | 'ordinary';

export type PrayerTheme =
  | 'hunger-poverty'    // food insecurity, Lent appeal, suffering
  | 'peace-conflict'    // war, reconciliation, peacemaking
  | 'emergency-crisis'  // disaster, acute humanitarian emergency
  | 'environment'       // creation, climate, Laudato Si
  | 'community-faith';  // general faith, ordinary time catch-all

export interface NextAction {
  id:           string;
  label:        string;
  description?: string;
  href:         string;                             // absolute URL or '#page' for internal nav
  variant:      'primary' | 'secondary' | 'ghost'; // primary = CAFOD blue filled
}

export interface Prayer {
  id: string;
  title: string;
  text: string;             // \n\n = paragraph break, \n = line break within verse
  scripture?: string;       // Companion verse, shown after the prayer text
  reflection?: string;      // Single contemplative question or thought
  attribution?: string;
  source?: string;
  season?: LiturgicalSeason;
  date?: string;            // ISO 8601 — for editorial scheduling
  backgroundImage?: string; // Full-screen background URL (Unsplash placeholder; CAFOD photography later)
  theme?: PrayerTheme;      // Drives NextActions selection
  nextActions?: NextAction[];
}

export interface PrayerEngagement {
  hasPrayed: boolean;
  count: number;
  handlePray: () => void;
}
