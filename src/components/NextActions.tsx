import type { NextAction } from '../types/prayer';
import type { AppPage }    from '../types/app';

interface NextActionsProps {
  nextActions: NextAction[];
  onNavigate?: (page: AppPage) => void;
}

// Internal links use '#page' convention (e.g. '#explore') and are
// intercepted here rather than followed as real hrefs.
function isInternal(href: string): boolean {
  return href.startsWith('#');
}

function internalPage(href: string): AppPage {
  return href.slice(1) as AppPage;
}

export function NextActions({ nextActions, onNavigate }: NextActionsProps) {
  return (
    <div className="mt-10 pt-8 border-t border-white/15 space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <p className="text-[11px] font-cafod font-semibold tracking-widest uppercase text-white/50 mb-5">
        What's next?
      </p>

      {nextActions.map(action => {
        const handleClick = isInternal(action.href)
          ? (e: React.MouseEvent) => { e.preventDefault(); onNavigate?.(internalPage(action.href)); }
          : undefined;

        if (action.variant === 'primary') {
          return (
            <a
              key={action.id}
              href={isInternal(action.href) ? undefined : action.href}
              onClick={handleClick}
              target={isInternal(action.href) ? undefined : '_blank'}
              rel={isInternal(action.href) ? undefined : 'noopener noreferrer'}
              className={[
                'block w-full px-6 py-3.5 text-center font-cafod font-bold text-sm text-white',
                // CAFOD signature button: only bottom-right corner rounded (rounded-br-2xl)
                'rounded-br-2xl rounded-tl-lg',
                'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0',
              ].join(' ')}
              style={{ background: '#222544' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#151728'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#222544'; }}
            >
              {action.label}
              {action.description && (
                <span className="block text-[11px] font-normal text-white/70 mt-0.5">
                  {action.description}
                </span>
              )}
            </a>
          );
        }

        if (action.variant === 'secondary') {
          return (
            <a
              key={action.id}
              href={isInternal(action.href) ? undefined : action.href}
              onClick={handleClick}
              target={isInternal(action.href) ? undefined : '_blank'}
              rel={isInternal(action.href) ? undefined : 'noopener noreferrer'}
              className={[
                'block w-full px-6 py-3.5 text-center font-cafod font-semibold text-sm text-white',
                'border border-white/40 hover:border-white/70 hover:bg-white/10',
                'rounded-br-2xl rounded-tl-lg',
                'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0',
              ].join(' ')}
            >
              {action.label}
              {action.description && (
                <span className="block text-[11px] font-normal text-white/60 mt-0.5">
                  {action.description}
                </span>
              )}
            </a>
          );
        }

        // ghost — plain text link with arrow
        return (
          <a
            key={action.id}
            href={isInternal(action.href) ? undefined : action.href}
            onClick={handleClick}
            target={isInternal(action.href) ? undefined : '_blank'}
            rel={isInternal(action.href) ? undefined : 'noopener noreferrer'}
            className="block text-sm font-cafod text-white/55 hover:text-white transition-colors duration-150 focus:outline-none focus:underline py-1"
          >
            {action.label}
          </a>
        );
      })}
    </div>
  );
}
