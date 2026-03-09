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
  onDark?: boolean;
  onRevealComplete: () => void;
}

const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  lent:     'Lent',
  advent:   'Advent',
  easter:   'Easter',
  ordinary: 'Ordinary Time',
};

function revealed(delaySeconds: number, reducedMotion: boolean): CSSProperties {
  if (reducedMotion) return {};
  return {
    opacity: 0,
    animation: `reveal 0.85s ease-out ${delaySeconds.toFixed(2)}s forwards`,
  };
}

export function PrayerContent({
  title, text, scripture, reflection, attribution, source,
  season, reducedMotion, onDark = false, onRevealComplete,
}: PrayerContentProps) {
  const paragraphs = text.split('\n\n').filter(Boolean);

  const lastParaStart    = 1.3 + (paragraphs.length - 1) * 0.95;
  const scriptureStart   = lastParaStart + 1.0;
  const reflectionStart  = lastParaStart + 1.7;
  const attributionStart = lastParaStart + 2.5;

  const lastRevealStart = attribution || source
    ? attributionStart
    : reflection ? reflectionStart
    : scripture  ? scriptureStart
    : lastParaStart;

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
      {/* Season label */}
      {season && (
        onDark ? (
          <span
            style={revealed(0.2, reducedMotion)}
            className="inline-block px-3 py-1 rounded-full text-[11px] font-cafod font-semibold tracking-widest uppercase bg-white/15 text-white/80 mb-5"
            aria-label={`Liturgical season: ${SEASON_LABELS[season]}`}
          >
            {SEASON_LABELS[season]}
          </span>
        ) : (
          <p
            style={revealed(0.2, reducedMotion)}
            className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-ink-300 mb-5"
            aria-label={`Liturgical season: ${SEASON_LABELS[season]}`}
          >
            {SEASON_LABELS[season]}
          </p>
        )
      )}

      {/* Title */}
      <h1
        style={revealed(0.6, reducedMotion)}
        className={`text-3xl sm:text-4xl font-serif leading-tight mb-8 ${onDark ? 'text-white' : 'text-ink-900'}`}
      >
        {title}
      </h1>

      {/* Prayer body */}
      <div role="article" aria-label="Prayer text" className="space-y-5">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            style={revealed(1.3 + i * 0.95, reducedMotion)}
            className={`text-lg sm:text-xl font-serif leading-relaxed whitespace-pre-line ${onDark ? 'text-white/90' : 'text-ink-700'}`}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Scripture */}
      {scripture && (
        <p
          style={revealed(scriptureStart, reducedMotion)}
          className={`mt-10 text-sm font-serif italic leading-relaxed ${onDark ? 'text-white/65' : 'text-ink-400'}`}
        >
          {scripture}
        </p>
      )}

      {/* Reflection */}
      {reflection && (
        <p
          style={revealed(reflectionStart, reducedMotion)}
          className={`mt-5 text-sm font-cafod leading-relaxed ${onDark ? 'text-white/70' : 'text-ink-500'}`}
        >
          {reflection}
        </p>
      )}

      {/* Attribution */}
      {(attribution || source) && (
        <div
          style={revealed(attributionStart, reducedMotion)}
          className={`mt-10 pt-6 border-t ${onDark ? 'border-white/20' : 'border-cream-200'}`}
        >
          {attribution && (
            <p className={`text-xs font-sans italic ${onDark ? 'text-white/50' : 'text-ink-300'}`}>
              — {attribution}
            </p>
          )}
          {source && (
            <p className={`text-xs font-sans mt-0.5 ${onDark ? 'text-white/40' : 'text-ink-300'}`}>
              {source}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
