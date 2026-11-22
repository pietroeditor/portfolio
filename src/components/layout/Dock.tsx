import { motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import type { View } from '@/hooks/useView';

/**
 * The dock, after the reference: one dark pill floating clear of the bottom
 * of the screen, holding the whole navigation. The indicator is a lit well
 * that slides between tabs rather than four separate backgrounds popping on
 * and off, which is what makes moving between sections read as one motion.
 *
 * It is the primary navigation, so it carries real anchors — the site still
 * works with JavaScript halfway loaded and the links still mean something to
 * a crawler.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const Grid = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden {...stroke}>
    <rect x="2" y="2" width="5" height="5" rx="1.2" />
    <rect x="9" y="2" width="5" height="5" rx="1.2" />
    <rect x="2" y="9" width="5" height="5" rx="1.2" />
    <rect x="9" y="9" width="5" height="5" rx="1.2" />
  </svg>
);

const Spark = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden {...stroke}>
    <path d="M6.6 2.2c0 2.5 1.3 3.8 3.8 3.8-2.5 0-3.8 1.3-3.8 3.8 0-2.5-1.3-3.8-3.8-3.8 2.5 0 3.8-1.3 3.8-3.8Z" />
    <path d="M11.8 9.6c0 1.2.6 1.8 1.8 1.8-1.2 0-1.8.6-1.8 1.8 0-1.2-.6-1.8-1.8-1.8 1.2 0 1.8-.6 1.8-1.8Z" />
  </svg>
);

const Person = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden {...stroke}>
    <circle cx="8" cy="5.4" r="2.6" />
    <path d="M2.9 13.4a5.1 5.1 0 0 1 10.2 0" />
  </svg>
);

const Users = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden {...stroke}>
    <circle cx="6.2" cy="5.6" r="2.4" />
    <path d="M1.8 13.2a4.4 4.4 0 0 1 8.8 0" />
    <path d="M10.8 3.6a2.4 2.4 0 0 1 0 4.5M12 9.6a4.4 4.4 0 0 1 2.3 3.6" />
  </svg>
);

const Mail = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden {...stroke}>
    <rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.6" />
    <path d="m2.6 4.8 5.4 3.8 5.4-3.8" />
  </svg>
);

/** In document order, so the indicator never travels against the scroll. */
const TABS = [
  /** The newest work, marked as such — and the opener. */
  { id: 'latest', label: 'Latest', icon: Spark, ring: true },
  { id: 'work', label: 'Work', icon: Grid, ring: false },
  { id: 'clients', label: 'Clients', icon: Users, ring: false },
  { id: 'about', label: 'About', icon: Person, ring: false },
  { id: 'contact', label: 'Contact', icon: Mail, ring: false },
] as const satisfies readonly { id: View; label: string; icon: unknown; ring: boolean }[];

export function Dock({ view, onGo }: { view: View; onGo: (next: View) => void }) {
  const active = view;

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed inset-x-0 z-[125] flex justify-center px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)' }}
      initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      <div className="glass-nav glass-edge flex items-center gap-0.5 rounded-full p-1.5">
        {TABS.map(({ id, label, icon, ring }) => {
          const current = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                onGo(id);
              }}
              aria-current={current ? 'true' : undefined}
              className={cn(
                'relative flex items-center gap-2 rounded-full px-3 py-2 text-meta font-medium transition-colors duration-300 ease-drift sm:px-3.5',
                // The halo sits at z-index -1, so the tab has to own a
                // stacking context or it would fall behind the whole dock.
                ring ? 'new-ring isolate text-ink' : current ? 'text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {current && (
                <motion.span
                  aria-hidden
                  layoutId="dock-well"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.07)',
                  }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{icon}</span>
              {/* The labels fold away on a phone; the icons carry it there. */}
              <span className="relative hidden sm:inline">{label}</span>
            </a>
          );
        })}

      </div>
    </motion.nav>
  );
}
