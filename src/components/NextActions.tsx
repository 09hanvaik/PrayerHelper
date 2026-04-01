import type { NextAction } from '../types/prayer';
import type { AppPage }    from '../types/app';

interface NextActionsProps {
  nextActions: NextAction[];
  onNavigate?: (page: AppPage) => void;
}

// Internal links use '#page' convention (e.g. '#explore') and are
// intercepted here rather than followed as real hrefs.
const VALID_PAGES = new Set<AppPage>(['home', 'explore', 'act', 'about']);

function isInternal(href: string): boolean {
  return href.startsWith('#');
}

function internalPage(href: string): AppPage {
  const page = href.slice(1);
  return VALID_PAGES.has(page as AppPage) ? (page as AppPage) : 'home';
}

const VARIANT_CLASSES: Record<NextAction['variant'], string> = {
  primary: [
    'block w-full px-6 py-3.5 text-center font-cafod font-bold text-sm text-white',
    'bg-cafod-navy hover:bg-cafod-navy-dark',
    'rounded-br-2xl rounded-tl-lg',
    'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0',
  ].join(' '),
  secondary: [
    'block w-full px-6 py-3.5 text-center font-cafod font-semibold text-sm text-white',
    'border border-white/40 hover:border-white/70 hover:bg-white/10',
    'rounded-br-2xl rounded-tl-lg',
    'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0',
  ].join(' '),
  ghost: 'block text-sm font-cafod text-white/55 hover:text-white transition-colors duration-150 focus:outline-none focus:underline py-1',
};

const DESC_CLASSES: Record<NextAction['variant'], string> = {
  primary:   'block text-[11px] font-normal text-white/70 mt-0.5',
  secondary: 'block text-[11px] font-normal text-white/60 mt-0.5',
  ghost:     '',
};

export function NextActions({ nextActions, onNavigate }: NextActionsProps) {
  return (
    <div className="mt-10 pt-8 border-t border-white/15 space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-white/50 mb-5">
        What's next?
      </p>

      {nextActions.map(action => {
        const internal = isInternal(action.href);

        const linkProps = {
          href:   internal ? undefined : action.href,
          target: internal ? undefined : '_blank' as const,
          rel:    internal ? undefined : 'noopener noreferrer',
          onClick: internal
            ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate?.(internalPage(action.href)); }
            : undefined,
        };

        return (
          <a key={action.id} {...linkProps} className={VARIANT_CLASSES[action.variant]}>
            {action.label}
            {action.description && action.variant !== 'ghost' && (
              <span className={DESC_CLASSES[action.variant]}>{action.description}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
