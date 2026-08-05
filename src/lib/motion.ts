import type { Transition, Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

/** State lands on a frame. Used for anything that changes, not arrives. */
export const EASE_CUT: Bezier = [0.16, 0.9, 0.2, 1];
/** Long, weighted arrivals. */
export const EASE_DRIFT: Bezier = [0.22, 1, 0.36, 1];
export const EASE_IN: Bezier = [0.7, 0, 0.84, 0];

export const transitions: Record<
  'cut' | 'cutOut' | 'element' | 'drift' | 'heavy',
  Transition
> = {
  cut: { duration: 0.16, ease: EASE_CUT },
  cutOut: { duration: 0.11, ease: EASE_IN },
  element: { duration: 0.34, ease: EASE_DRIFT },
  drift: { duration: 0.72, ease: EASE_DRIFT },
  heavy: { duration: 1.1, ease: EASE_DRIFT },
};

/** The beat an editor leaves before a reveal lands. */
export const HOLD = 0.07;

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;

/**
 * Entrances travel through depth and resolve out of defocus. Opacity only
 * rides along — it is never the whole transition.
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 46, z: -140, scale: 0.965, filter: 'blur(14px)' },
  visible: {
    opacity: 1,
    y: 0,
    z: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.86, ease: EASE_DRIFT },
  },
};

/** For headings — comes further, lands harder. */
export const dropIn: Variants = {
  hidden: { opacity: 0, y: 64, scale: 0.94, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_DRIFT },
  },
};

/** Objects arrive from behind the plane of the screen. */
export const pushIn: Variants = {
  hidden: { opacity: 0, scale: 0.86, filter: 'blur(24px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.15, ease: EASE_DRIFT },
  },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};
