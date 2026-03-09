import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { LiturgicalSeason } from '../types/prayer';

interface PrayerContentProps {
  title: string;
  text: string;
  scripture?: string;
  reflection?: string;
  attribution?: string;
  source?: string;
  season?: LiturgicalSeason;
  reducedMotion: boolean;
  onRevealComplete: () => void;
}

const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  lent:     'Lent',
  advent:   'Advent',
  easter:   'Easter',
  ordinary: 'Ordinary Time',
};

// Returns the inline style that makes an element invisible until its
// stagger animation fires. When reducedMotion is true the CSS class
// html.reduce-motion collapses all animation durations to 0.001ms,
// so every element jumps immediately to its visible state.
function revealed(delaySeconds: number, reducedMotion: boolean): CSSProperties {
  if (reducedMotion) return {}; // CSS handles instant reveal via html.reduce-motion
  return {
    opacity: 0,
    animation: `reveal 0.85s ease-out ${delaySeconds.toFixed(2)}s forwards`,
  };
}

// Reveal sequence timing (seconds):
//   season label   0.2
//   title          0.6
//   paragraph[i]   1.3 + i × 0.95
//   scripture      lastPara + 1.0
//   reflection     lastPara + 1.7
//   attribution    lastPara + 2.5
//   done callback  last + 0.85 (anim) + 0.35 (buffer)

export function PrayerContent({
  title,
  text,
  scripture,
  reflection,
  attribution,
  source,
  season,
  reducedMotion,
  onRevealComplete,
}: PrayerContentProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  const lastParaStart    = 1.3 + (paragraphs.length - 1) * 0.95;
  const scriptureStart   = lastParaStart + 1.0;
  const reflectionStart  = lastParaStart + 1.7;
  const attributionStart = lastParaStart + 2.5;

  const lastRevealStart = attribution || source
    ? attributionStart
    : reflection
      ? reflectionStart
      : scripture
        ? scriptureStart
        : lastParaStart;

  // Fires immediately when reducedMotion is on (CSS already shows content)
  const revealDoneMs = reducedMotion
    ? 50
    : Math.round((lastRevealStart + 0.85 + 0.35) * 1000);

  useEffect(() => {
    const id = setTimeout(onRevealComplete, revealDoneMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {season && (
        <p
          style={revealed(0.2, reducedMotion)}
          className="text-[11px] font-sans font-semibold tracking-widest uppercase text-ink-300 mb-5"
          aria-label={`Liturgical season: ${SEASON_LABELS[season]}`}
        >
          {SEASON_LABELS[season]}
        </p>
      )}

      <h1
        style={revealed(0.6, reducedMotion)}
        className="text-3xl sm:text-4xl font-serif text-ink-900 leading-tight mb-8"
      >
        {title}
      </h1>

      <div role="article" aria-label="Prayer text" className="space-y-5">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            style={revealed(1.3 + i * 0.95, reducedMotion)}
            className="text-lg sm:text-xl font-serif text-ink-700 leading-relaxed whitespace-pre-line"
          >
            {para}
          </p>
        ))}
      </div>

      {scripture && (
        <p
          style={revealed(scriptureStart, reducedMotion)}
          className="mt-10 text-sm font-serif text-ink-400 italic leading-relaxed"
        >
          {scripture}
        </p>
      )}

      {reflection && (
        <p
          style={revealed(reflectionStart, reducedMotion)}
          className="mt-5 text-sm font-sans text-ink-500 leading-relaxed"
        >
          {reflection}
        </p>
      )}

      {(attribution || source) && (
        <div style={revealed(attributionStart, reducedMotion)} className="mt-10 pt-6 border-t border-cream-200">
          {attribution && (
            <p className="text-xs font-sans text-ink-300 italic">— {attribution}</p>
          )}
          {source && (
            <p className="text-xs font-sans text-ink-300 mt-0.5">{source}</p>
          )}
        </div>
      )}
    </div>
  );
}
