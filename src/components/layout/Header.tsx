import { motion } from 'framer-motion';

import type { SiteConfig } from '@/types';

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Worlds', href: '#worlds' },
  { label: 'Contact', href: '#contact' },
];

export function Header({ site }: { site: SiteConfig }) {
  return (
    <motion.header
      className="relative z-20 flex items-center justify-between gap-4 px-gutter pt-6"
      initial={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#work" className="flex items-center gap-2.5">
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
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="text-meta font-medium text-muted transition-colors duration-200 hover:text-ink"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className="rounded-full bg-ink px-4 py-2.5 text-meta font-semibold text-shell transition-transform duration-300 hover:scale-[1.03] active:scale-95"
      >
        Work with me
      </a>
    </motion.header>
  );
}
