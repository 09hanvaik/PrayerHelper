import type { AppPage } from '../types/app';

interface ActScreenProps {
  onNavigate: (page: AppPage) => void;
}

const ACTIONS = [
  {
    label: 'Donate to the Lent Appeal',
    description: 'Help families facing hunger and poverty this Lent.',
    href: 'https://cafod.org.uk/give/appeals/lent-appeal',
  },
  {
    label: 'Join a campaign',
    description: 'Call on governments to act on poverty, debt, and climate justice.',
    href: 'https://cafod.org.uk/campaign',
  },
  {
    label: 'Write to your MP',
    description: 'Urge UK leaders to prioritise the world\'s most vulnerable.',
    href: 'https://cafod.org.uk/campaign',
  },
  {
    label: 'Sign up for weekly prayers',
    description: 'Receive CAFOD\'s Friday gospel reflection by email.',
    href: 'https://cafod.org.uk/news/subscribe',
  },
];

export function ActScreen({ onNavigate }: ActScreenProps) {
  return (
    <main id="main-content" className="min-h-screen bg-cream-100 flex flex-col items-center px-6 py-24 animate-fade-in" aria-label="Faith in action">
      <div className="w-full max-w-prayer">
        <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-ink-300 mb-4 text-center">
          Act
        </p>
        <h1 className="text-3xl font-serif text-ink-900 mb-3 text-center">Faith in action</h1>
        <p className="text-sm font-sans text-ink-500 text-center mb-10 leading-relaxed">
          Prayer and action belong together. Here are ways to respond.
        </p>

        <div className="space-y-4">
          {ACTIONS.map(action => (
            <a
              key={action.href + action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white rounded-card shadow-card hover:shadow-md transition-shadow duration-150 text-left group"
            >
              <p className="font-cafod font-bold text-cafod-navy text-sm group-hover:underline">{action.label}</p>
              <p className="text-xs font-sans text-ink-500 mt-1 leading-relaxed">{action.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm font-cafod text-ink-400 hover:text-ink-700 transition-colors duration-150"
          >
            ← Back to prayer
          </button>
        </div>
      </div>
    </main>
  );
}
