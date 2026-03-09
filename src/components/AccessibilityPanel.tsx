import { useState } from 'react';
import type { A11yPrefs } from '../hooks/useA11yPrefs';

interface AccessibilityPanelProps {
  prefs: A11yPrefs;
  onToggle: (key: keyof A11yPrefs) => void;
  navVisible?: boolean; // when true, raise above the bottom nav bar
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="w-full flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-lg p-1 -m-1"
    >
      <div className="text-left">
        <p className="text-sm font-sans text-ink-700 font-medium">{label}</p>
        <p className="text-xs font-sans text-ink-400 mt-0.5">{description}</p>
      </div>

      <div
        className={['flex-shrink-0 w-10 h-6 rounded-full relative transition-colors duration-200', checked ? 'bg-gold-500' : 'bg-ink-300'].join(' ')}
        aria-hidden="true"
      >
        <span className={['absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-1'].join(' ')} />
      </div>
    </button>
  );
}

export function AccessibilityPanel({ prefs, onToggle, navVisible = false }: AccessibilityPanelProps) {
  const [open, setOpen] = useState(false);
  // Raise above the bottom nav bar (h-16 = 4rem) when nav is visible
  const bottomClass = navVisible ? 'bottom-20' : 'bottom-5';

  return (
    <div className={`fixed ${bottomClass} right-5 z-50 flex flex-col items-end gap-2`}>
      {open && (
        <div
          className="bg-white/92 backdrop-blur-md border border-cream-200 rounded-2xl shadow-card p-5 w-60 animate-fade-in"
          role="dialog"
          aria-label="Accessibility options"
        >
          <p className="text-[10px] font-sans font-semibold tracking-widest uppercase text-ink-300 mb-4">
            Accessibility
          </p>
          <div className="space-y-4">
            <ToggleRow
              label="Larger text"
              description="Increase reading size"
              checked={prefs.largeText}
              onChange={() => onToggle('largeText')}
            />
            <ToggleRow
              label="Reduce motion"
              description="Skip animations"
              checked={prefs.reducedMotion}
              onChange={() => onToggle('reducedMotion')}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Accessibility options"
        aria-expanded={open}
        className={[
          'w-10 h-10 rounded-full border shadow-card flex items-center justify-center',
          'font-sans font-semibold text-sm transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
          open
            ? 'bg-white text-ink-700 border-ink-300'
            : 'bg-white/80 backdrop-blur-sm text-ink-400 border-cream-200 hover:text-ink-700 hover:bg-white hover:border-ink-300',
        ].join(' ')}
      >
        <span aria-hidden="true">Aa</span>
      </button>
    </div>
  );
}
