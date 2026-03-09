export const MOODS = [
  { id: 'grateful', label: 'Grateful'        },
  { id: 'anxious',  label: 'Anxious'          },
  { id: 'tired',    label: 'Tired'            },
  { id: 'seeking',  label: 'Seeking guidance' },
  { id: 'pausing',  label: 'Just pausing'     },
] as const;

export type MoodId = typeof MOODS[number]['id'];

interface MoodSelectorProps {
  onSelect: (mood: MoodId) => void;
  onDark?: boolean;
}

export function MoodSelector({ onSelect, onDark = false }: MoodSelectorProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in"
      aria-label="Mood check-in before prayer"
    >
      <p className={`text-[11px] font-cafod font-semibold tracking-widest uppercase mb-8 ${onDark ? 'text-white/60' : 'text-ink-300'}`}>
        How are you coming to prayer today?
      </p>

      <div
        className="flex flex-wrap justify-center gap-3 max-w-xs"
        role="group"
        aria-label="Mood options"
      >
        {MOODS.map(mood => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={[
              'px-5 py-2.5 text-sm font-cafod rounded-full',
              'transition-all duration-200 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              onDark
                ? 'bg-white/15 border border-white/30 text-white hover:bg-white/28 hover:border-white/55 focus:ring-white'
                : 'bg-white/60 border border-cream-200 text-ink-600 hover:bg-white/90 hover:border-ink-300 focus:ring-gold-500',
            ].join(' ')}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
