import { useState, useMemo } from 'react';
import type { AppPage } from '../types/app';
import type { Prayer, LiturgicalSeason, PrayerTheme } from '../types/prayer';

interface ExploreScreenProps {
  prayers: Prayer[];
  onNavigate: (page: AppPage) => void;
}

const SEASON_LABELS: Record<LiturgicalSeason, string> = {
  lent:     'Lent',
  easter:   'Easter',
  advent:   'Advent',
  ordinary: 'Ordinary Time',
};

const THEME_LABELS: Record<PrayerTheme, string> = {
  'hunger-poverty':   'Hunger & Poverty',
  'peace-conflict':   'Peace & Conflict',
  'emergency-crisis': 'Emergency',
  'environment':      'Creation & Climate',
  'community-faith':  'Faith & Community',
};

const SEASON_COLOURS: Record<LiturgicalSeason, string> = {
  lent:     'bg-purple-100 text-purple-700',
  easter:   'bg-amber-50 text-amber-700',
  advent:   'bg-violet-100 text-violet-700',
  ordinary: 'bg-emerald-50 text-emerald-700',
};

type SeasonFilter = 'all' | LiturgicalSeason;

function firstLine(text: string): string {
  const line = text.split('\n')[0].trim();
  return line.length > 80 ? line.slice(0, 77) + '...' : line;
}

export function ExploreScreen({ prayers, onNavigate }: ExploreScreenProps) {
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('all');
  const [themeFilter, setThemeFilter]   = useState<PrayerTheme | null>(null);
  const [expandedId, setExpandedId]     = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = prayers;
    if (seasonFilter !== 'all') {
      result = result.filter(p => p.season === seasonFilter);
    }
    if (themeFilter) {
      result = result.filter(p => p.theme === themeFilter);
    }
    return result;
  }, [prayers, seasonFilter, themeFilter]);

  // Available themes for the current season filter (hide empty chips)
  const availableThemes = useMemo(() => {
    const base = seasonFilter === 'all' ? prayers : prayers.filter(p => p.season === seasonFilter);
    const themes = new Set(base.map(p => p.theme).filter(Boolean) as PrayerTheme[]);
    return Object.keys(THEME_LABELS).filter(t => themes.has(t as PrayerTheme)) as PrayerTheme[];
  }, [prayers, seasonFilter]);

  function clearFilters() {
    setSeasonFilter('all');
    setThemeFilter(null);
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-cream-100 px-5 pt-20 pb-24 animate-fade-in"
      aria-label="Explore prayers"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-ink-300 mb-2">
          Explore
        </p>
        <h1 className="text-3xl font-serif text-ink-900 mb-6">Prayer Collection</h1>

        {/* Season filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filter by season">
          {(['all', 'lent', 'easter', 'advent', 'ordinary'] as SeasonFilter[]).map(s => (
            <button
              key={s}
              role="tab"
              aria-selected={seasonFilter === s}
              onClick={() => { setSeasonFilter(s); setThemeFilter(null); }}
              className={[
                'px-4 py-1.5 text-sm font-cafod font-semibold rounded-full transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-cafod-navy focus:ring-offset-1',
                seasonFilter === s
                  ? 'bg-cafod-navy text-white'
                  : 'bg-white border border-cream-200 text-ink-500 hover:border-ink-300 hover:text-ink-700',
              ].join(' ')}
            >
              {s === 'all' ? 'All' : SEASON_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Theme filter chips */}
        {availableThemes.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by theme">
            {availableThemes.map(t => (
              <button
                key={t}
                onClick={() => setThemeFilter(themeFilter === t ? null : t)}
                className={[
                  'px-3 py-1 text-xs font-cafod font-medium rounded-full transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-cafod-navy focus:ring-offset-1',
                  themeFilter === t
                    ? 'bg-cafod-navy text-white'
                    : 'bg-cream-200 text-ink-500 hover:bg-cream-100 hover:text-ink-700',
                ].join(' ')}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-xs font-cafod text-ink-300 mb-4">
          {filtered.length} {filtered.length === 1 ? 'prayer' : 'prayers'}
          {seasonFilter !== 'all' || themeFilter ? (
            <>
              {' · '}
              <button onClick={clearFilters} className="underline hover:text-ink-500 transition-colors">
                clear filters
              </button>
            </>
          ) : null}
        </p>

        {/* Prayer cards */}
        <div className="space-y-3">
          {filtered.map(prayer => {
            const isExpanded = expandedId === prayer.id;

            return (
              <article
                key={prayer.id}
                className="bg-white rounded-card shadow-card border border-cream-200 overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : prayer.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left px-5 py-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cafod-navy"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Season + theme badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {prayer.season && (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-cafod font-bold tracking-wide uppercase ${SEASON_COLOURS[prayer.season]}`}>
                            {SEASON_LABELS[prayer.season]}
                          </span>
                        )}
                        {prayer.theme && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-cafod font-medium tracking-wide text-ink-400 bg-cream-100">
                            {THEME_LABELS[prayer.theme]}
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-serif text-ink-900 leading-snug">
                        {prayer.title}
                      </h2>
                      {!isExpanded && (
                        <p className="text-sm font-sans text-ink-400 mt-1 truncate">
                          {firstLine(prayer.text)}
                        </p>
                      )}
                    </div>

                    {/* Expand chevron */}
                    <svg
                      className={`w-5 h-5 text-ink-300 flex-shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded prayer content */}
                {isExpanded && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="border-t border-cream-200 pt-4 space-y-4">
                      {/* Prayer text */}
                      <div className="space-y-3">
                        {prayer.text.split('\n\n').filter(Boolean).map((para, i) => (
                          <p key={i} className="text-base font-serif text-ink-700 leading-relaxed whitespace-pre-line">
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Scripture */}
                      {prayer.scripture && (
                        <p className="text-sm font-serif italic text-ink-400 leading-relaxed mt-4">
                          {prayer.scripture}
                        </p>
                      )}

                      {/* Reflection */}
                      {prayer.reflection && (
                        <p className="text-sm font-cafod text-ink-500 leading-relaxed">
                          {prayer.reflection}
                        </p>
                      )}

                      {/* Attribution */}
                      {(prayer.attribution || prayer.source) && (
                        <div className="pt-3 border-t border-cream-200">
                          {prayer.attribution && (
                            <p className="text-xs font-sans italic text-ink-300">
                              — {prayer.attribution}
                            </p>
                          )}
                          {prayer.source && (
                            <p className="text-xs font-sans text-ink-300 mt-0.5">
                              {prayer.source}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-ink-400 font-sans text-sm mb-4">No prayers match these filters.</p>
            <button
              onClick={clearFilters}
              className="text-sm font-cafod font-semibold text-cafod-navy hover:underline focus:outline-none"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Back to today */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('home')}
            className="px-8 py-3 bg-cafod-navy text-white font-cafod font-bold text-sm rounded-br-2xl rounded-tl-lg hover:bg-cafod-navy-dark transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cafod-navy focus:ring-offset-2"
          >
            Back to today's prayer
          </button>
        </div>
      </div>
    </main>
  );
}
