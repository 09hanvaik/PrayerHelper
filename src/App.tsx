import { useMemo, useState } from 'react';
import { EntryScreen }        from './components/EntryScreen';
import { MoodSelector }       from './components/MoodSelector';
import type { MoodId }        from './components/MoodSelector';
import { PrayerContent }      from './components/PrayerContent';
import { PrayerActions }      from './components/PrayerActions';
import { PrayerCounter }      from './components/PrayerCounter';
import { NextActions }        from './components/NextActions';
import { CAFODNav }           from './components/CAFODNav';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { ExploreScreen }      from './components/ExploreScreen';
import { ActScreen }          from './components/ActScreen';
import { AboutScreen }        from './components/AboutScreen';
import { usePrayerEngagement } from './hooks/usePrayerEngagement';
import { useA11yPrefs }       from './hooks/useA11yPrefs';
import { useLiturgicalDay }   from './hooks/useLiturgicalDay';
import type { AppPage }       from './types/app';
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

  const dated = prayers.find(p => p.date === today);
  if (dated) return dated;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000,
  );

  const seasonal = prayers.filter(p => p.season === season);
  if (seasonal.length > 0) return seasonal[dayOfYear % seasonal.length];

  return prayers[dayOfYear % prayers.length];
}

// "Sunday · 8 March · Third Sunday of Lent"
function formatHeader(weekLabel: string): string {
  const datePart = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  }).replace(',', ' ·');
  return `${datePart} · ${weekLabel}`;
}

// Full prayer text for TTS: title, body, scripture, reflection (attribution excluded)
function composeTtsText(p: Prayer): string {
  return [p.title + '.', p.text, p.scripture, p.reflection]
    .filter(Boolean)
    .join('\n\n');
}

export default function App() {
  const { prefs, toggle } = useA11yPrefs();
  const liturgicalDay     = useLiturgicalDay();

  const prayer  = useMemo(() => getTodaysPrayer(liturgicalDay.season), [liturgicalDay.season]);
  const { hasPrayed, count, handlePray } = usePrayerEngagement(prayer.id);
  const ttsText = useMemo(() => composeTtsText(prayer), [prayer]);

  // Navigation page
  const [page, setPage] = useState<AppPage>('home');

  // Home phases:
  //   1. Entry ("Be still")   — skipped when reducedMotion is on
  //   2. Mood check-in        — gates the prayer
  //   3. Prayer text reveals  — staggered animation
  //   4. Interaction          — button + counter + next actions
  const [entryDone,    setEntryDone]    = useState(() => prefs.reducedMotion);
  const [mood,         setMood]         = useState<MoodId | null>(null);
  const [textRevealed, setTextRevealed] = useState(false);

  const moodSelected = mood !== null;

  // Chrome (nav bars) hides during active prayer phases, reappears at interaction
  const praying = page === 'home' && (!entryDone || !moodSelected || !textRevealed);

  // Scene class: full-screen photo when prayer has a backgroundImage, else animated gradient
  const hasBgImage = page === 'home' && !!prayer.backgroundImage;
  const sceneClass = hasBgImage
    ? 'prayer-scene relative min-h-screen overflow-hidden'
    : 'prayer-bg relative min-h-screen overflow-hidden';

  return (
    <div
      className={sceneClass}
      style={hasBgImage
        ? { '--bg-image': `url(${prayer.backgroundImage})` } as React.CSSProperties
        : undefined}
    >
      {/* Ambient orbs — only on gradient background (out of place on dark photo) */}
      {!hasBgImage && (
        <>
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: '12%', left: '8%', width: '520px', height: '520px',
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
              bottom: '8%', right: '6%', width: '440px', height: '440px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(195,165,225,0.13) 0%, transparent 70%)',
              filter: 'blur(52px)',
              animation: 'orbFloat2 28s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* ── Home: Phase 1 — centering moment ──────────────────── */}
      {page === 'home' && !entryDone && (
        <EntryScreen
          onComplete={() => setEntryDone(true)}
          onDark={hasBgImage}
        />
      )}

      {/* ── Home: Phase 2 — mood check-in ─────────────────────── */}
      {page === 'home' && entryDone && !moodSelected && (
        <MoodSelector onSelect={setMood} onDark={hasBgImage} />
      )}

      {/* ── Home: Phases 3 + 4 — prayer reveal + interaction ──── */}
      {page === 'home' && entryDone && moodSelected && (
        <>
          {/* Liturgical date — subtle, above prayer, hidden during reading */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 pt-20 text-center pointer-events-none z-10"
          >
            <p className={`text-[10px] font-cafod font-medium tracking-[0.3em] uppercase opacity-60 ${hasBgImage ? 'text-white/70' : 'text-ink-300'}`}>
              {formatHeader(liturgicalDay.weekLabel)}
            </p>
          </div>

          <main
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-24"
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
                onDark={hasBgImage}
                onRevealComplete={() => setTextRevealed(true)}
              />

              {/* Interaction area — appears after full prayer reveal */}
              {textRevealed && (
                <div className="animate-fade-in">
                  <PrayerCounter
                    count={count}
                    hasPrayed={hasPrayed}
                    onDark={hasBgImage}
                  />
                  <PrayerActions
                    hasPrayed={hasPrayed}
                    onPray={handlePray}
                    ttsText={ttsText}
                    onDark={hasBgImage}
                  />
                  {prayer.nextActions && prayer.nextActions.length > 0 && (
                    <NextActions
                      nextActions={prayer.nextActions}
                      onNavigate={setPage}
                    />
                  )}
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ── Stub pages ─────────────────────────────────────────── */}
      {page === 'explore' && <ExploreScreen onNavigate={setPage} />}
      {page === 'act'     && <ActScreen     onNavigate={setPage} />}
      {page === 'about'   && <AboutScreen   onNavigate={setPage} />}

      {/* ── Persistent chrome ──────────────────────────────────── */}
      <CAFODNav
        visible={!praying}
        currentPage={page}
        onNavigate={setPage}
      />
      <AccessibilityPanel
        prefs={prefs}
        onToggle={toggle}
        navVisible={!praying}
      />
    </div>
  );
}
