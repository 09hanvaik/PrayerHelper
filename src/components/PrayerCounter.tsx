interface PrayerCounterProps {
  count: number;
  hasPrayed: boolean;
}

export function PrayerCounter({ count, hasPrayed }: PrayerCounterProps) {
  if (hasPrayed) {
    // After pressing — the communal moment: you're part of something larger
    return (
      <div className="mt-8 animate-fade-in">
        <p className="text-base font-sans text-ink-600">
          You've joined{' '}
          <span className="font-semibold text-ink-800">
            {count.toLocaleString()}
          </span>{' '}
          {count === 1 ? 'person' : 'people'} in prayer today.
        </p>
      </div>
    );
  }

  // Before pressing — social proof that invites participation
  return (
    <p className="text-xs font-sans text-ink-300 tracking-wide mt-8">
      {count.toLocaleString()} {count === 1 ? 'person has' : 'people have'} prayed this today
    </p>
  );
}
