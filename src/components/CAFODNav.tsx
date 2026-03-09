import type { AppPage } from '../types/app';

interface CAFODNavProps {
  visible: boolean;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

// CAFOD brand colours (from --color-cafod-blue-core and --color-cafod-green-core)
// Header SVG wave path from cafod.org.uk/components/static/Header/HeaderBackground.svg

const tabs: { id: AppPage; label: string; icon: React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Today',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.02 12.02.708.708M1 12h1m20 0h1M4.22 19.78l.707-.707M18.95 5.636l.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7Z" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Explore',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: 'act',
    label: 'Act',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  },
];

export function CAFODNav({ visible, currentPage, onNavigate }: CAFODNavProps) {
  return (
    <>
      {/* ── Top header bar ───────────────────────────────────── */}
      <header
        className="chrome-fade fixed top-0 left-0 right-0 z-[60] h-14 overflow-hidden"
        data-hidden={!visible}
        aria-label="CAFOD navigation"
      >
        {/* CAFOD navy background */}
        <div className="absolute inset-0" style={{ background: '#222544' }} />

        {/* Lime-green SVG wave — matches the CAFOD header decoration */}
        {/* Source: cafod.org.uk/components/static/Header/HeaderBackground.svg */}
        <svg
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-full w-auto opacity-50 pointer-events-none"
          viewBox="0 0 488 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMax meet"
        >
          <path d="M0 0V240L57.1757 22.4066L457.908 120L488 0H0Z" fill="#A2C614" />
        </svg>

        {/* Wordmark */}
        <div className="relative z-10 h-full flex items-center px-5">
          <span
            className="font-cafod font-extrabold text-white text-xl tracking-tight leading-none"
            aria-label="CAFOD — Catholic Agency For Overseas Development"
          >
            CAFOD
          </span>
          {/* TODO: replace with official CAFOD SVG logo asset */}
        </div>
      </header>

      {/* ── Bottom tab bar ───────────────────────────────────── */}
      <nav
        className="chrome-fade fixed bottom-0 left-0 right-0 z-[60] h-16 border-t"
        data-hidden={!visible}
        aria-label="Main navigation"
        style={{ background: 'rgba(34,37,68,0.92)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="h-full flex items-stretch">
          {tabs.map(tab => {
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-cafod font-semibold tracking-wide',
                  'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset',
                  isActive
                    ? 'text-[#a2c617] focus:ring-[#a2c617]'
                    : 'text-white/60 hover:text-white focus:ring-white/40',
                ].join(' ')}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ background: '#a2c617' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
