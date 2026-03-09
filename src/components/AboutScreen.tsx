import type { AppPage } from '../types/app';

interface AboutScreenProps {
  onNavigate: (page: AppPage) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center px-6 py-24 animate-fade-in">
      <div className="w-full max-w-prayer text-center">
        <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-ink-300 mb-4">
          About
        </p>
        <h1 className="text-3xl font-serif text-ink-900 mb-6">About this app</h1>

        <p className="text-base font-sans text-ink-600 leading-relaxed mb-6">
          This daily prayer resource is a ministry of{' '}
          <a href="https://cafod.org.uk" target="_blank" rel="noopener noreferrer"
            className="font-cafod font-bold text-cafod-navy hover:underline">
            CAFOD
          </a>
          {' '}— the Catholic Agency For Overseas Development.
        </p>

        <p className="text-sm font-sans text-ink-500 leading-relaxed mb-10">
          CAFOD works with communities in need across Africa, Asia, Latin America, and the Middle East —
          inspired by the Gospel call to serve the poor and to work for a just and peaceful world.
        </p>

        <div className="space-y-3 text-sm">
          <a href="https://cafod.org.uk" target="_blank" rel="noopener noreferrer"
            className="block font-cafod font-semibold text-cafod-navy hover:underline">
            cafod.org.uk →
          </a>
          <a href="https://cafod.org.uk/pray" target="_blank" rel="noopener noreferrer"
            className="block font-cafod text-ink-400 hover:text-cafod-navy transition-colors duration-150">
            More CAFOD prayer resources →
          </a>
          <a href="https://cafod.org.uk/about-us/privacy-and-accessibility" target="_blank" rel="noopener noreferrer"
            className="block font-cafod text-ink-400 hover:text-cafod-navy transition-colors duration-150">
            Privacy policy →
          </a>
        </div>

        <div className="mt-12">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm font-cafod text-ink-400 hover:text-ink-700 transition-colors duration-150"
          >
            ← Back to prayer
          </button>
        </div>
      </div>
    </div>
  );
}
