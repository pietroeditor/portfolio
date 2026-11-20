import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Scroll-driven depth, damped.
 *
 * Every `[data-depth]` pane gets three numbers: `--d`, how far it sits from
 * the reading line; `--dx`, how far from the centre of the screen; and
 * `--fl`, a slow sine that never stops. The bend, the recession and the drift
 * are all derived from them in CSS, so a frame costs three custom properties
 * per pane and not one React render.
 *
 * The damping is the point. Writing the measured value straight to the
 * transform makes a wheel notch — a hundred pixels at once — land as a jump,
 * and the whole grid reads as stepped. Here the measurement only moves a
 * target, and the value chases it a fraction at a time, so the panes keep
 * easing after the scroll has already stopped. With the sine underneath,
 * nothing is ever quite still.
 */

/** How much of the remaining distance is closed each frame. */
const CHASE = 0.085;
/** Below this the pane has arrived and stops being written. */
const SETTLED = 0.0004;

interface Pane {
  el: HTMLElement;
  /** Where the scroll says it should be. */
  targetD: number;
  targetX: number;
  /** Where it actually is, this frame. */
  d: number;
  dx: number;
  /** Keeps neighbouring panes from breathing in lockstep. */
  phase: number;
  speed: number;
}

export function DepthField({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let panes: Pane[] = [];
    let frame = 0;
    let dirty = true;

    const collect = () => {
      panes = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el, i) => ({
        el,
        targetD: 0,
        targetX: 0,
        d: 0,
        dx: 0,
        // Irrational-ish steps, so the phases never line back up.
        phase: (i * 2.399963) % (Math.PI * 2),
        speed: 0.00022 + (i % 5) * 0.00004,
      }));
      dirty = true;
    };

    /** Rect reads are the expensive part, so they only happen after a scroll. */
    const retarget = () => {
      const middle = window.innerHeight / 2;
      const reach = window.innerHeight * 0.7;
      const centreX = window.innerWidth / 2;
      const reachX = window.innerWidth / 2;

      for (const pane of panes) {
        const box = pane.el.getBoundingClientRect();
        // A pane with no box (display:none, mid-layout) would divide into a
        // NaN and poison the transform, so it is simply left where it is.
        if (!box.height) continue;

        const offset = box.top + box.height / 2 - middle;
        pane.targetD = Math.max(-1, Math.min(1, offset / reach));

        const offsetX = box.left + box.width / 2 - centreX;
        pane.targetX = Math.max(-1, Math.min(1, offsetX / reachX));
      }
    };

    const tick = (now: number) => {
      if (dirty) {
        retarget();
        dirty = false;
      }

      for (const pane of panes) {
        pane.d += (pane.targetD - pane.d) * CHASE;
        pane.dx += (pane.targetX - pane.dx) * CHASE;

        // Snap the last sliver, so a pane never sits forever at 0.0001.
        if (Math.abs(pane.targetD - pane.d) < SETTLED) pane.d = pane.targetD;
        if (Math.abs(pane.targetX - pane.dx) < SETTLED) pane.dx = pane.targetX;

        pane.el.style.setProperty('--d', pane.d.toFixed(4));
        pane.el.style.setProperty('--dx', pane.dx.toFixed(4));
        pane.el.style.setProperty(
          '--fl',
          Math.sin(now * pane.speed + pane.phase).toFixed(4),
        );
      }

      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      dirty = true;
    };

    collect();
    frame = requestAnimationFrame(tick);

    // Cards arrive with their data, so the set is rebuilt when it changes.
    const observer = new MutationObserver(collect);
    observer.observe(root, { childList: true, subtree: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', collect, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', collect);
    };
  }, []);

  return (
    <div ref={ref} className="depth-field">
      {children}
    </div>
  );
}
