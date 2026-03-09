import type { AppPage } from '../types/app';

interface ExploreScreenProps {
  onNavigate: (page: AppPage) => void;
}

export function ExploreScreen({ onNavigate }: ExploreScreenProps) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 py-24 text-center animate-fade-in">
      <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-ink-300 mb-4">
        Explore
      </p>
      <h1 className="text-3xl font-serif text-ink-900 mb-4">More prayers</h1>
      <p className="text-base font-sans text-ink-500 max-w-sm leading-relaxed mb-10">
        Prayer collections by season, theme, and holy day are coming soon.
      </p>
      <button
        onClick={() => onNavigate('home')}
        className="px-8 py-3 bg-cafod-navy text-white font-cafod font-bold text-sm rounded-br-2xl rounded-tl-lg hover:bg-cafod-navy-dark transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cafod-navy focus:ring-offset-2"
      >
        Back to today's prayer
      </button>
    </div>
  );
}
