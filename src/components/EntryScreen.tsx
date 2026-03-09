import { useEffect } from 'react';

interface EntryScreenProps {
  onComplete: () => void;
}

// Duration of the entire entry experience in milliseconds.
// The SVG progress ring traces this exact duration, so users can see
// how much time remains — making the pause feel intentional, not frozen.
const ENTRY_DURATION_MS = 3400;

// SVG circle geometry
const RADIUS       = 38;
const CIRCUMFERENCE = parseFloat((2 * Math.PI * RADIUS).toFixed(2)); // 238.76

export function EntryScreen({ onComplete }: EntryScreenProps) {
  useEffect(() => {
    const id = setTimeout(onComplete, ENTRY_DURATION_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-7"
      aria-live="polite"
    >
      {/* SVG breathing animation — communicates "intentional pause, not a freeze" */}
      <div
        aria-hidden="true"
        style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out both` }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Faint track ring */}
          <circle
            cx="50" cy="50" r={RADIUS}
            stroke="rgba(184,149,46,0.12)"
            strokeWidth="1.5"
          />

          {/* Progress ring — traces from 0% to 100% over ENTRY_DURATION_MS */}
          <circle
            cx="50" cy="50" r={RADIUS}
            stroke="rgba(184,149,46,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            style={{
              transform:       'rotate(-90deg)',
              transformOrigin: '50px 50px',
              animation:       `progressFill ${ENTRY_DURATION_MS}ms linear forwards`,
            }}
          />

          {/* Middle breathing ring — pulses gently to signal "breathing" */}
          <circle
            cx="50" cy="50" r="20"
            stroke="rgba(184,149,46,0.3)"
            strokeWidth="1"
            style={{
              transformOrigin: '50px 50px',
              animation:       'breatheRing 3.5s ease-in-out infinite',
            }}
          />

          {/* Centre dot — breathing core */}
          <circle
            cx="50" cy="50" r="5"
            fill="rgba(184,149,46,0.55)"
            style={{
              transformOrigin: '50px 50px',
              animation:       'breatheInner 3.5s ease-in-out infinite',
            }}
          />
        </svg>
      </div>

      {/* Centering verse */}
      <div>
        <p
          className="text-2xl sm:text-3xl font-serif text-ink-700"
          style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out 0.1s both` }}
        >
          Be still
        </p>
        <p
          className="text-sm font-sans text-ink-400 tracking-wide mt-2 italic"
          style={{ animation: `entryReveal ${ENTRY_DURATION_MS}ms ease-in-out 0.25s both` }}
        >
          and know that I am God. — Psalm 46:10
        </p>
      </div>
    </div>
  );
}
