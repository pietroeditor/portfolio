import { cn } from '@/lib/cn';

/**
 * Paint fill.
 *
 * A sheet of white that floods the card from the bottom on hover, behind a
 * mask whose leading edge is broken into droplets — the same liquid boundary
 * the section transitions use. Only `mask-position` animates, so the whole
 * flood stays on the compositor.
 */

const DROPS = [
  [4, 3.2],
  [11, 2.0],
  [18, 4.4],
  [26, 2.4],
  [33, 3.6],
  [41, 2.1],
  [48, 4.8],
  [56, 2.7],
  [63, 3.4],
  [71, 2.2],
  [78, 4.1],
  [86, 2.6],
  [93, 3.3],
] as const;

const MASK = [
  'linear-gradient(to bottom, transparent 0 44%, #000 56% 100%)',
  ...DROPS.map(
    ([x, r]) => `radial-gradient(${r}% ${r * 1.6}% at ${x}% 50%, #000 0 56%, transparent 60%)`,
  ),
].join(',');

interface PaintFillProps {
  /** Drives the flood. */
  active: boolean;
  className?: string;
  /** Milliseconds for the flood to travel the full card. */
  duration?: number;
}

export function PaintFill({ active, className, duration = 620 }: PaintFillProps) {
  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 62%, rgba(255,255,255,0.98) 100%)',
        maskImage: MASK,
        WebkitMaskImage: MASK,
        maskSize: '100% 230%',
        WebkitMaskSize: '100% 230%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: active ? '0% 100%' : '0% 0%',
        WebkitMaskPosition: active ? '0% 100%' : '0% 0%',
        transition: `mask-position ${duration}ms cubic-bezier(0.22,1,0.36,1), -webkit-mask-position ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
      }}
    />
  );
}
