import { useMemo, useState } from 'react';
import { EntryScreen }        from './components/EntryScreen';
import { MoodSelector }       from './components/MoodSelector';
import type { MoodId }        from './components/MoodSelector';
import { PrayerContent }      from './components/PrayerContent';
import { PrayerActions }      from './components/PrayerActions';
import { PrayerCounter }      from './components/PrayerCounter';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { usePrayerEngagement } from './hooks/usePrayerEngagement';
import { useA11yPrefs }       from './hooks/useA11yPrefs';
import { useLiturgicalDay }   from './hooks/useLiturgicalDay';
import type { LiturgicalSeason } from './types/prayer';
import prayersData from './data/prayers.json';
import type { Prayer } from './types/prayer';

const prayers = prayersData as Prayer[];

// Prayer selection — three-tier priority:
//   1. Exact date match on prayer.date  (editorial scheduling wins)
//   2. Season-matching prayers, rotated by day-of-year within the season
//   3. All-prayer day-of-year rotation  (fallback when no seasonal content)
function getTodaysPrayer(season: LiturgicalSeason): Prayer {
  const now   = new Date();
  const today = now.toISOString().split('T')[0];

  // 1. Date-exact match (editorial scheduling wins — no dayOfYear needed)
  const dated = prayers.find(p => p.date === today);
  if (dated) return dated;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000,
  );

  // 2. Season-matched rotation
  const seasonal = prayers.filter(p => p.season === season);
  if (seasonal.length > 0) return seasonal[dayOfYear % seasonal.length];

  // 3. Global fallback
  return prayers[dayOfYear % prayers.length];
}

// "Sunday · 8 March · Third Sunday of Lent"
// weekLabel comes from the liturgical calendar (local computation or API)
function formatHeader(weekLabel: string): string {
  const datePart = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  }).replace(',', ' ·');
  return `${datePart} · ${weekLabel}`;
}

// Full prayer text assembled for TTS: title, body, scripture, reflection
function composeTtsText(p: Prayer): string {
  return [p.title + '.', p.text, p.scripture, p.reflection]
    .filter(Boolean)
    .join('\n\n');
}

export default function App() {
  const { prefs, toggle }  = useA11yPrefs();
  const liturgicalDay      = useLiturgicalDay();       // local-first; enriched by Church Calendar API

  // Prayer selection is season-aware; re-evaluates if liturgical season changes
  const prayer   = useMemo(() => getTodaysPrayer(liturgicalDay.season), [liturgicalDay.season]);
  const { hasPrayed, count, handlePray } = usePrayerEngagement(prayer.id);
  const ttsText  = useMemo(() => composeTtsText(prayer), [prayer]);

  // App phases:
  //   1. Entry ("Be still")      — skipped when reducedMotion is on
  //   2. Mood selector           — daily check-in before prayer
  //   3. Prayer reveals itself   — staggered text animation
  //   4. Interaction area        — button + counter appear after full reveal

  const [entryDone,    setEntryDone]    = useState(() => prefs.reducedMotion);
  const [mood,         setMood]         = useState<MoodId | null>(null);
  const [textRevealed, setTextRevealed] = useState(false);

  const moodSelected = mood !== null;

  return (
    <div className="prayer-bg relative min-h-screen overflow-hidden">

      {/* Ambient light orbs — always present, GPU-composited */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '12%', left: '8%',
          width: '520px', height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,198,100,0.16) 0%, transparent 70%)',
          filter: 'blur(48px)',
          animation: 'orbFloat 22s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '8%', right: '6%',
          width: '440px', height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(195,165,225,0.13) 0%, transparent 70%)',
          filter: 'blur(52px)',
          animation: 'orbFloat2 28s ease-in-out infinite',
        }}
      />

      {/* ── Phase 1: Centering moment ────────────────────────────── */}
      {!entryDone && (
        <EntryScreen onComplete={() => setEntryDone(true)} />
      )}

      {/* ── Phase 2: Mood check-in ───────────────────────────────── */}
      {entryDone && !moodSelected && (
        <MoodSelector onSelect={setMood} />
      )}

      {/* ── Phase 3 + 4: Prayer experience ──────────────────────── */}
      {entryDone && moodSelected && (
        <>
          {/* Liturgical date header — from Church Calendar API or local computation */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 pt-7 text-center pointer-events-none"
          >
            <p className="text-[10px] font-sans font-medium tracking-[0.3em] uppercase text-ink-300 opacity-60">
              {formatHeader(liturgicalDay.weekLabel)}
            </p>
          </div>

          <main
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24"
            aria-label="Daily prayer"
          >
            <div className="w-full max-w-prayer text-center animate-fade-in">
              <PrayerContent
                title={prayer.title}
                text={prayer.text}
                scripture={prayer.scripture}
                reflection={prayer.reflection}
                attribution={prayer.attribution}
                source={prayer.source}
                season={prayer.season}
                reducedMotion={prefs.reducedMotion}
                onRevealComplete={() => setTextRevealed(true)}
              />

              {textRevealed && (
                <div className="animate-fade-in">
                  <PrayerCounter count={count} hasPrayed={hasPrayed} />
                  <PrayerActions
                    hasPrayed={hasPrayed}
                    onPray={handlePray}
                    ttsText={ttsText}
                  />
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* Accessibility panel — always available */}
      <AccessibilityPanel prefs={prefs} onToggle={toggle} />
    </div>
  );
}
