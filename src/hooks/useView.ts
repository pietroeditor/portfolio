import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Document order. The spy walks this list and takes the last section whose
 * top has passed the reading line, so it has to match the order the sections
 * are actually laid out in — not the order they were written in.
 */
export const VIEWS = ['latest', 'work', 'clients', 'about', 'contact'] as const;
export type View = (typeof VIEWS)[number];

const DEFAULT: View = 'latest';

/** Where down the viewport a section counts as the one being read. */
const READING_LINE = 0.34;
/** How long the scroll has to be still before the spy is trusted again. */
const SETTLE = 140;

function parse(hash: string): View | null {
  const id = hash.replace('#', '');
  return (VIEWS as readonly string[]).includes(id) ? (id as View) : null;
}

/**
 * Which section is being read.
 *
 * The site is one page: the sections sit under each other and you scroll
 * through them. The nav and the dock only mark where you are and move you
 * there — nothing is ever hidden, so there is one document to crawl, one
 * scroll position to share, and the depth field runs across the whole thing
 * instead of restarting at every click.
 */
export function useView(): [View, (next: View) => void] {
  const [view, setView] = useState<View>(() =>
    typeof window === 'undefined' ? DEFAULT : (parse(window.location.hash) ?? DEFAULT),
  );

  /**
   * While a nav click is still travelling, every section it passes would
   * otherwise claim the highlight in turn — so the spy is held off until the
   * scroll goes quiet. `arm` is the effect's own settle timer, reached through
   * a ref because `go` has to be able to start it for a scroll of its own.
   */
  const locked = useRef<View | null>(null);
  const arm = useRef<() => void>(() => {});

  useEffect(() => {
    let frame = 0;
    let idle = 0;

    const pick = (): View => {
      const line = window.innerHeight * READING_LINE;
      let best: View = VIEWS[0];

      VIEWS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) best = id;
      });

      /**
       * The last section is shorter than the viewport, so on a tall screen
       * its top never reaches the reading line and it could never win. At the
       * foot of the document it takes it outright.
       */
      const doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) {
        best = VIEWS[VIEWS.length - 1];
      }

      return best;
    };

    const measure = () => {
      frame = 0;
      if (locked.current) return;

      const next = pick();
      setView((prev) => {
        if (prev === next) return prev;
        // Replaced, never pushed: scrolling must not fill up the Back button.
        window.history.replaceState(null, '', `#${next}`);
        return next;
      });
    };

    const settle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        locked.current = null;
        measure();
      }, SETTLE);
    };

    arm.current = settle;

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      // Each event pushes the settle point out, so when it finally fires
      // whatever was moving the page — a wheel or a nav click — has stopped.
      settle();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    /**
     * A link straight to a section. React has only just put the section in the
     * DOM, so the browser's own jump fired at parse time against nothing.
     */
    const landing = parse(window.location.hash);
    if (landing) document.getElementById(landing)?.scrollIntoView({ behavior: 'auto' });
    else measure();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      arm.current = () => {};
    };
  }, []);

  const travel = useCallback((next: View, push: boolean) => {
    locked.current = next;
    setView(next);
    if (push) window.history.pushState(null, '', `#${next}`);

    // An explicit behaviour outranks the stylesheet's, so the preference has
    // to be read here too or a nav click would animate against the setting.
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';

    const el = document.getElementById(next);
    if (el) el.scrollIntoView({ behavior, block: 'start' });
    else window.scrollTo({ top: 0, behavior });

    // Started here as well: a target already in place fires no scroll event,
    // and the spy would stay locked for the rest of the visit.
    arm.current();
  }, []);

  const go = useCallback((next: View) => travel(next, true), [travel]);

  useEffect(() => {
    const onPop = () => travel(parse(window.location.hash) ?? DEFAULT, false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [travel]);

  return [view, go];
}
