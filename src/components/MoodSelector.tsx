export const MOODS = [
  { id: 'grateful', label: 'Grateful'         },
  { id: 'anxious',  label: 'Anxious'           },
  { id: 'tired',    label: 'Tired'             },
  { id: 'seeking',  label: 'Seeking guidance'  },
  { id: 'pausing',  label: 'Just pausing'      },
] as const;

export type MoodId = typeof MOODS[number]['id'];

interface MoodSelectorProps {
  onSelect: (mood: MoodId) => void;
}

export function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center animate-fade-in"
      aria-label="Mood check-in before prayer"
    >
      <p className="text-[11px] font-sans font-semibold tracking-widest uppercase text-ink-300 mb-8">
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
              'px-5 py-2.5 rounded-full text-sm font-sans text-ink-600',
              'bg-white/60 hover:bg-white/90 border border-cream-200 hover:border-ink-300',
              'transition-all duration-200 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
            ].join(' ')}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
