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
import { useHashRoute }       from './hooks/useHashRoute';
import { useImagePreload }    from './hooks/useImagePreload';
import type { LiturgicalSeason, PrayerTheme } from './types/prayer';
import prayersData from './data/prayers.json';
import type { Prayer } from './types/prayer';

const prayers = prayersData as Prayer[];

if (prayers.length === 0) {
  throw new Error('No prayers loaded — prayers.json must contain at least one entry');
}

// Mood → theme affinity: first theme is strongest match, rest are acceptable fallbacks.
// Ensures each mood gets a distinct prayer flavour while keeping pools large enough.
const MOOD_THEMES: Record<MoodId, PrayerTheme[]> = {
  grateful: ['community-faith', 'environment'],
  anxious:  ['peace-conflict', 'community-faith'],
  tired:    ['community-faith', 'hunger-poverty'],
  seeking:  ['community-faith', 'hunger-poverty', 'peace-conflict'],
  pausing:  ['environment', 'community-faith'],
};

// Prayer selection — five-tier priority:
//   1. Exact date match (editorial scheduling always wins)
//   2. Season + mood primary theme, rotated by dayOfYear + moodOffset
//   3. Season + any mood affinity theme
//   4. Season-only fallback
//   5. Global fallback
function getTodaysPrayer(season: LiturgicalSeason, mood: MoodId | null): Prayer {
  const now   = new Date();
  const today = now.toISOString().split('T')[0];

  // Tier 1: editorial date-exact
  const dated = prayers.find(p => p.date === today);
  if (dated) return dated;

  const dayOfYear = Math.floor(
    (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000,
  );

  // Offset by mood so different moods on the same day get different prayers
  const moodKeys: MoodId[] = ['grateful', 'anxious', 'tired', 'seeking', 'pausing'];
  const moodOffset = mood ? moodKeys.indexOf(mood) : 0;
  const rotationKey = dayOfYear * 5 + moodOffset;

  const seasonal = prayers.filter(p => p.season === season);

  if (mood && seasonal.length > 0) {
    const affinityThemes = MOOD_THEMES[mood];

    // Tier 2: season + primary theme
    const primary = seasonal.filter(p => p.theme === affinityThemes[0]);
    if (primary.length > 0) return primary[rotationKey % primary.length];

    // Tier 3: season + any affinity theme
    const affinity = seasonal.filter(p =>
      affinityThemes.includes(p.theme as PrayerTheme),
    );
    if (affinity.length > 0) return affinity[rotationKey % affinity.length];
  }

  // Tier 4: season-only
  if (seasonal.length > 0) return seasonal[rotationKey % seasonal.length];

  // Tier 5: global fallback
  return prayers[rotationKey % prayers.length];
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

  // Navigation — hash-based for browser back/forward support
  const { page, navigate: setPage } = useHashRoute();

  // Home phases:
  //   1. Entry ("Be still")   — skipped when reducedMotion is on
  //   2. Mood check-in        — gates the prayer (and drives prayer selection)
  //   3. Prayer text reveals  — staggered animation
  //   4. Interaction          — button + counter + next actions
  const [entryDone,    setEntryDone]    = useState(() => prefs.reducedMotion);
  const [mood,         setMood]         = useState<MoodId | null>(null);
  const [textRevealed, setTextRevealed] = useState(false);

  // Prayer selection depends on both season and mood
  const prayer  = useMemo(() => getTodaysPrayer(liturgicalDay.season, mood), [liturgicalDay.season, mood]);
  const { hasPrayed, count, handlePray } = usePrayerEngagement(prayer.id);
  const ttsText = useMemo(() => composeTtsText(prayer), [prayer]);

  const moodSelected = mood !== null;

  // Chrome (nav bars) hides during active prayer phases, reappears at interaction
  const praying = page === 'home' && (!entryDone || !moodSelected || !textRevealed);

  // Scene class: full-screen photo when prayer has a backgroundImage, else animated gradient
  const hasBgImage = page === 'home' && !!prayer.backgroundImage;
  const bgLoaded   = useImagePreload(hasBgImage ? prayer.backgroundImage : undefined);
  const sceneClass = hasBgImage
    ? 'prayer-scene relative min-h-screen overflow-hidden'
    : 'prayer-bg relative min-h-screen overflow-hidden';

  return (
    <div
      className={sceneClass}
      style={hasBgImage
        ? {
            '--bg-image': `url(${prayer.backgroundImage})`,
            '--bg-opacity': bgLoaded ? '1' : '0',
          } as React.CSSProperties
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
            id="main-content"
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
                  {(prayer.nextActions?.length ?? 0) > 0 && (
                    <NextActions
                      nextActions={prayer.nextActions!}
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
      {page === 'explore' && <ExploreScreen prayers={prayers} onNavigate={setPage} />}
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
