interface PrayerCounterProps {
  count: number;
  hasPrayed: boolean;
  onDark?: boolean;
}

export function PrayerCounter({ count, hasPrayed, onDark = false }: PrayerCounterProps) {
  if (hasPrayed) {
    return (
      <div className="mt-8 animate-fade-in">
        <p className={`text-base font-cafod ${onDark ? 'text-white/80' : 'text-ink-600'}`}>
          You've joined{' '}
          <span className={`font-bold ${onDark ? 'text-white' : 'text-ink-800'}`}>
            {count.toLocaleString()}
          </span>{' '}
          {count === 1 ? 'person' : 'people'} in prayer today.
        </p>
      </div>
    );
  }

  return (
    <p className={`text-xs font-cafod tracking-wide mt-8 ${onDark ? 'text-white/50' : 'text-ink-300'}`}>
      {count.toLocaleString()} {count === 1 ? 'person has' : 'people have'} prayed this today
    </p>
  );
}
