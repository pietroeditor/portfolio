import { useEffect, useState } from 'react';

/**
 * Which section is currently being read.
 *
 * A reading line across the middle of the viewport picks the section under it.
 * The last section on the page can never reach that line — the document runs
 * out of scroll first — so hitting the bottom hands it the active state
 * outright. Measured on a scroll listener throttled to one animation frame,
 * which is what makes both ends of the page behave.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    let timer = 0;

    const measure = () => {
      const doc = document.documentElement;
      const atBottom = window.scrollY >= doc.scrollHeight - window.innerHeight - 2;

      if (atBottom) {
        const last = ids[ids.length - 1] ?? null;
        setActive((prev) => (prev === last ? prev : last));
        return;
      }

      const line = window.innerHeight / 2;
      let next: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom >= line) {
          next = id;
          break;
        }
      }

      setActive((prev) => (prev === next ? prev : next));
    };

    /** A timer races the frame, so a starved tab can never wedge the throttle. */
    const run = () => {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
      frame = 0;
      timer = 0;
      measure();
    };

    const schedule = () => {
      if (frame || timer) return;
      frame = requestAnimationFrame(run);
      timer = window.setTimeout(run, 120);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
}
