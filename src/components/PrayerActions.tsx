import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface PrayerActionsProps {
  hasPrayed: boolean;
  onPray: () => void;
  ttsText: string;
  donateHref?: string;
}

export function PrayerActions({
  hasPrayed,
  onPray,
  ttsText,
  donateHref = 'https://www.cafod.org.uk/give',
}: PrayerActionsProps) {
  const [isRippling, setIsRippling] = useState(false);
  const { supported: ttsSupported, isPlaying, play, stop } = useSpeech(ttsText);

  function handlePrayClick() {
    if (hasPrayed) return;
    setIsRippling(true);
    if (isPlaying) stop(); // stop reading aloud when user marks as prayed
    onPray();
    setTimeout(() => setIsRippling(false), 750);
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      {/* Primary CTA */}
      <button
        onClick={handlePrayClick}
        disabled={hasPrayed}
        aria-label={hasPrayed ? 'You have prayed this prayer' : 'Mark that you have prayed this prayer'}
        style={!hasPrayed ? { animation: 'breathe 3s ease-in-out infinite' } : undefined}
        className={[
          'relative overflow-hidden px-12 py-4 rounded-full font-sans font-semibold text-sm tracking-wide',
          'transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
          hasPrayed
            ? 'bg-olive-100 text-olive-700 cursor-default'
            : 'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700',
        ].join(' ')}
      >
        {isRippling && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-white/40"
            style={{ animation: 'ripple 0.75s ease-out forwards' }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {hasPrayed && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {hasPrayed ? 'Prayed' : 'I Prayed This'}
        </span>
      </button>

      {hasPrayed && (
        <p className="text-sm font-sans text-ink-400 italic animate-fade-in">
          Thank you for praying.
        </p>
      )}

      {/* Secondary row: listen + donate */}
      <div className="flex items-center gap-5 mt-1">
        {ttsSupported && (
          <button
            onClick={isPlaying ? stop : play}
            aria-label={isPlaying ? 'Stop reading' : 'Listen to this prayer'}
            className={[
              'flex items-center gap-1.5 text-xs font-sans tracking-wide transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 rounded',
              isPlaying ? 'text-gold-600' : 'text-ink-300 hover:text-ink-500',
            ].join(' ')}
          >
            {isPlaying ? (
              /* Stop icon */
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              /* Speaker icon */
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            )}
            {isPlaying ? 'Stop' : 'Listen'}
          </button>
        )}

        <a
          href={donateHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-sans text-ink-300 hover:text-olive-600 transition-colors duration-150 tracking-wide"
        >
          Support CAFOD →
        </a>
      </div>
    </div>
  );
}
