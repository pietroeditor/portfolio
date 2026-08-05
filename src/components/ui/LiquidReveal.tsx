import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Organic section transition.
 *
 * The section rises into view behind a mask whose leading edge is broken up by
 * droplets, so the boundary eats into the section above it instead of being a
 * straight line. The mask is a fixed pattern and only its *position* animates,
 * which keeps the whole effect on the compositor.
 */

/** Deterministic droplet field baked into the mask, once. */
const DROPS = [
  [6, 3.4],
  [14, 2.1],
  [23, 4.6],
  [31, 2.6],
  [39, 3.9],
  [47, 2.2],
  [54, 4.9],
  [62, 2.8],
  [70, 3.6],
  [78, 2.3],
  [86, 4.2],
  [94, 2.9],
] as const;

const MASK = [
  // The body of the reveal.
  'linear-gradient(to bottom, transparent 0 46%, #000 54% 100%)',
  // Droplets straddling the edge, so it tears rather than cuts.
  ...DROPS.map(
    ([x, r]) =>
      `radial-gradient(${r}% ${r * 1.5}% at ${x}% 50%, #000 0 58%, transparent 62%)`,
  ),
].join(',');

interface LiquidRevealProps {
  children: ReactNode;
  className?: string;
  /** Milliseconds the dissolve takes once it starts. */
  duration?: number;
}

export function LiquidReveal({ children, className, duration = 1100 }: LiquidRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -18% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maskStyle = {
    maskImage: MASK,
    WebkitMaskImage: MASK,
    maskSize: '100% 240%',
    WebkitMaskSize: '100% 240%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: shown ? '0% 100%' : '0% 0%',
    WebkitMaskPosition: shown ? '0% 100%' : '0% 0%',
    transition: `mask-position ${duration}ms cubic-bezier(0.22,1,0.36,1), -webkit-mask-position ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
  } as const;

  return (
    <div ref={ref} className={cn('relative', className)} style={maskStyle}>
      {children}
    </div>
  );
}
