import { motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { useActiveSection } from '@/hooks/useActiveSection';
import type { SiteConfig } from '@/types';

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'worlds', label: 'Worlds' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Stable identity so the observer is never rebuilt. */
const SECTION_IDS = NAV.map((n) => n.id);

export function Header({ site }: { site: SiteConfig }) {
  const active = useActiveSection(SECTION_IDS);

  return (
    <motion.header
      className="relative z-20 flex items-center justify-between gap-4 px-gutter pt-11"
      initial={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#what-i-do" className="flex items-center gap-2.5">
        <span
          className="h-6 w-6 rounded-full"
          style={{
            background:
              'conic-gradient(from 40deg, rgb(var(--accent)), #ffffff 40%, rgb(var(--accent)) 80%)',
            boxShadow: '0 1px 2px rgba(10,10,11,0.22)',
          }}
        />
        <span className="text-[1.0625rem] font-semibold tracking-[-0.022em]">{site.name}</span>
      </a>

      <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
        {NAV.map(({ id, label }) => {
          const current = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={current ? 'true' : undefined}
              className={cn(
                'relative text-meta font-medium transition-colors duration-300 ease-drift',
                current ? 'text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {label}
              {/* Hairline that draws in from the left — the whole indicator. */}
              <span
                aria-hidden
                className={cn(
                  'absolute -bottom-1.5 left-0 h-px w-full origin-left bg-ink/35',
                  'transition-transform duration-300 ease-drift',
                  current ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </a>
          );
        })}
      </nav>

      <a
        href="#contact"
        className="rounded-full bg-ink px-4 py-2.5 text-meta font-semibold text-shell transition-transform duration-300 ease-drift hover:scale-[1.03] active:scale-95"
      >
        Work with me
      </a>
    </motion.header>
  );
}
