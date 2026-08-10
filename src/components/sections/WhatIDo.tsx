import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

import { riseIn, stagger, viewportOnce } from '@/lib/motion';

/**
 * Same card anatomy as the rest of the site: a quiet glass shell, a dominant
 * title, and a bar at the bottom a shade brighter than the body. Only the
 * contents differ — nothing new is introduced to the design system.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Two clips on a timeline with the playhead parked over them. */
const Timeline = (
  <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden {...stroke}>
    <rect x="2.4" y="4.7" width="10.4" height="3.5" rx="1.1" />
    <rect x="2.4" y="11.3" width="6.8" height="3.5" rx="1.1" />
    <path d="M15.5 2.9v14.2" />
  </svg>
);

/** The idea before the cut. */
const Spark = (
  <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden {...stroke}>
    <path d="M8.4 2.6c0 3.2 1.7 4.9 4.9 4.9-3.2 0-4.9 1.7-4.9 4.9 0-3.2-1.7-4.9-4.9-4.9 3.2 0 4.9-1.7 4.9-4.9Z" />
    <path d="M15 12.2c0 1.5.8 2.3 2.3 2.3-1.5 0-2.3.8-2.3 2.3 0-1.5-.8-2.3-2.3-2.3 1.5 0 2.3-.8 2.3-2.3Z" />
  </svg>
);

/** Framing corners with a focus point — how a shot gets chosen. */
const Frame = (
  <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden {...stroke}>
    <path d="M3 7.2V4.5A1.5 1.5 0 0 1 4.5 3H7.2" />
    <path d="M12.8 3h2.7A1.5 1.5 0 0 1 17 4.5v2.7" />
    <path d="M17 12.8v2.7a1.5 1.5 0 0 1-1.5 1.5h-2.7" />
    <path d="M7.2 17H4.5A1.5 1.5 0 0 1 3 15.5v-2.7" />
    <circle cx="10" cy="10" r="1.7" />
  </svg>
);

/** A queue of cuts waiting to go out. */
const Stack = (
  <svg viewBox="0 0 20 20" width="19" height="19" aria-hidden {...stroke}>
    <rect x="2.8" y="3" width="14.4" height="4.3" rx="1.3" />
    <rect x="2.8" y="8.9" width="14.4" height="4.3" rx="1.3" />
    <path d="M5.6 16.3h8.8" />
  </svg>
);

const ROLES = [
  {
    key: 'video-editor',
    icon: Timeline,
    title: 'Video Editor',
    line: 'Long-form gaming, storytelling, pacing, sound design & retention.',
  },
  {
    key: 'creative-editor',
    icon: Spark,
    title: 'Creative Editor',
    line: 'Video structure, hooks, pacing & editing ideas.',
  },
  {
    key: 'creative-director',
    icon: Frame,
    title: 'Creative Director',
    line: 'Visual direction, structure & content identity.',
  },
  {
    key: 'content-manager',
    icon: Stack,
    title: 'Content Manager',
    line: 'Content organization, scheduling, uploads & workflow.',
  },
] as const;

/**
 * Stateless on purpose. These panes stay transparent through the hover, so
 * everything is CSS — no re-render, and the surface behind the card is never
 * painted over.
 */
function RoleCard({ icon, title, line }: { icon: ReactNode; title: string; line: string }) {
  return (
    <div className="group glass-water relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-3 transition-transform duration-[480ms] ease-drift hover:-translate-y-1">
      <span
        className="relative z-[1] grid h-11 w-11 place-items-center rounded-[0.75rem] text-muted transition-[color,transform] duration-[480ms] ease-drift group-hover:-translate-y-px group-hover:scale-[1.06] group-hover:text-ink"
        style={{
          background:
            'linear-gradient(150deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22) 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(10,10,11,0.045), 0 1px 2px rgba(10,10,11,0.03)',
        }}
      >
        {icon}
      </span>

      <span className="relative z-[1] block px-1 pb-3.5 pt-5 text-cardTitle">{title}</span>

      {/* Pinned to the bottom with a two-line floor, so all four stay level. */}
      <p
        className="relative z-[1] mt-auto min-h-[4.375rem] rounded-[0.75rem] px-3.5 py-3 text-pretty text-[0.9375rem] font-medium leading-[1.5] tracking-[-0.012em] text-muted transition-colors duration-[480ms] ease-drift group-hover:bg-white/40"
        style={{
          background: 'rgba(255,255,255,0.24)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 0 0 1px rgba(10,10,11,0.04)',
        }}
      >
        {line}
      </p>
    </div>
  );
}

export function WhatIDo() {
  return (
    // Sections rest on the bottom only. This one closes tighter than a `bay`:
    // it reads as the lead-in to the work, so the two sit as one block.
    <section id="what-i-do" className="relative pb-block pt-6">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.h2 variants={riseIn} className="max-w-[20ch] text-balance text-title">
            What I do.
          </motion.h2>

          <div className="mt-block grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map(({ key, icon, title, line }) => (
              <motion.div key={key} variants={riseIn} className="h-full">
                <RoleCard icon={icon} title={title} line={line} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
