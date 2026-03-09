import { useEffect } from 'react';

interface EntryScreenProps {
  onComplete: () => void;
  onDark?: boolean;
}

const ENTRY_DURATION_MS = 3400;
const RADIUS            = 38;
const CIRCUMFERENCE     = parseFloat((2 * Math.PI * RADIUS).toFixed(2)); // 238.76

export function EntryScreen({ onComplete, onDark = false }: EntryScreenProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, ENTRY_DURATION_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SVG ring colours: slightly brighter on dark backgrounds for visibility
  const ringTrack    = onDark ? 'rgba(162,198,23,0.20)' : 'rgba(184,149,46,0.12)';
  const ringProgress = onDark ? 'rgba(162,198,23,0.60)' : 'rgba(184,149,46,0.50)';
  const ringBreath   = onDark ? 'rgba(162,198,23,0.35)' : 'rgba(184,149,46,0.30)';
  const dotFill      = onDark ? 'rgba(162,198,23,0.70)' : 'rgba(184,149,46,0.55)';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-7"
      aria-live="polite"
    >
      {/* SVG breathing animation */}
      <div
        aria-hidden="true"
        style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out both` }}
      >
        <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r={RADIUS} stroke={ringTrack} strokeWidth="1.5" />
          <circle
            cx="50" cy="50" r={RADIUS}
            stroke={ringProgress} strokeWidth="1.5" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', animation: `progressFill ${ENTRY_DURATION_MS}ms linear forwards` }}
          />
          <circle
            cx="50" cy="50" r="20"
            stroke={ringBreath} strokeWidth="1"
            style={{ transformOrigin: '50px 50px', animation: 'breatheRing 3.5s ease-in-out infinite' }}
          />
          <circle
            cx="50" cy="50" r="5"
            fill={dotFill}
            style={{ transformOrigin: '50px 50px', animation: 'breatheInner 3.5s ease-in-out infinite' }}
          />
        </svg>
      </div>

      <div>
        <p
          className={`text-2xl sm:text-3xl font-serif ${onDark ? 'text-white' : 'text-ink-700'}`}
          style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out 0.1s both` }}
        >
          Be still
        </p>
        <p
          className={`text-sm font-sans tracking-wide mt-2 italic ${onDark ? 'text-white/60' : 'text-ink-400'}`}
          style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out 0.25s both` }}
        >
          and know that I am God. — Psalm 46:10
        </p>
      </div>
    </div>
  );
}
