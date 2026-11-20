import { useEffect, useState } from 'react';

import { Liquid } from '@/components/bg/Liquid';

/**
 * A band hugging the four viewport edges. Each gradient is opaque at its own
 * edge and gone a little past the frame; the four layers union together, so
 * the whole interior of the shell is left untouched.
 */
const BAND = 'calc(var(--frame) + 18px)';
const RIM = [
  `linear-gradient(to right, #000, transparent ${BAND})`,
  `linear-gradient(to left, #000, transparent ${BAND})`,
  `linear-gradient(to bottom, #000, transparent ${BAND})`,
  `linear-gradient(to top, #000, transparent ${BAND})`,
].join(', ');

/** Past this the aurora is fully gone, so nothing below it needs tracking. */
const AURORA_REACH = 1150;

/**
 * Scroll depth, in pixels, clamped to the distance the aurora actually cares
 * about. Clamping is what keeps this cheap: once the reader is past the top of
 * the page the value stops changing, React bails on the identical state, and
 * the listener costs a comparison per frame and nothing else.
 */
function useAuroraScroll(): number {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    let frame = 0;
    let timer = 0;

    const measure = () => {
      const next = Math.min(Math.round(window.scrollY), AURORA_REACH);
      setDepth((prev) => (prev === next ? prev : next));
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

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  return depth;
}

/** The visible edge of the object. Drawn over everything, never interactive. */
export function Shell() {
  return (
    <>
      {/*
        Liquid Glass rim. Four edge gradients union into a band that hugs the
        outside of the shell and is completely transparent everywhere else, so
        nothing inside the frame is ever touched — the content stays sharp to
        the last pixel and only what spills past the edge goes under the glass.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[115]"
        style={{
          backdropFilter: 'blur(18px) saturate(150%) brightness(0.72)',
          WebkitBackdropFilter: 'blur(18px) saturate(150%) brightness(0.72)',
          // Smoked film — thickest at the very edge, gone by the frame.
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.4) 44%, rgba(0,0,0,0.42) 58%, rgba(0,0,0,0.66) 100%)',
          maskImage: RIM,
          WebkitMaskImage: RIM,
          transform: 'translateZ(0)',
        }}
      />

      {/*
        The surface of the glass itself: a wide diagonal sheen and a corner
        falloff. It is what turns the frame from a border into a panel you
        are looking at, which is the whole reason the grid bows behind it.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-[118]"
        style={{
          top: 'var(--frame)',
          right: 'var(--frame)',
          bottom: 'var(--frame)',
          left: 'var(--frame)',
          borderRadius: 'var(--shell-radius)',
          background: [
            'linear-gradient(104deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 26%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.03) 100%)',
            'radial-gradient(130% 110% at 50% 44%, transparent 52%, rgba(0,0,0,0.46) 100%)',
          ].join(', '),
        }}
      />

      <div
        aria-hidden
        className="shell-frame pointer-events-none fixed z-[120]"
        style={{
          top: 'var(--frame)',
          right: 'var(--frame)',
          bottom: 'var(--frame)',
          left: 'var(--frame)',
        }}
      />
    </>
  );
}

/**
 * The surface inside the frame.
 *
 * Near-black, with an aurora burning through the top of it: one cold body
 * bleeding in from the upper left, a deeper one answering from the right, and
 * the live canvas drifting underneath. The page sits in the dark and the
 * light comes from above it, which is the whole proposition of the reference.
 */
export function Backdrop() {
  const scroll = useAuroraScroll();

  // Rides up at a fraction of the page and is gone a viewport and a bit in,
  // so it belongs to the top of the site instead of following the reader.
  const lift = scroll * 0.45;
  const fade = Math.max(0, 1 - scroll / AURORA_REACH);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-0 overflow-hidden bg-shell"
      style={{
        top: 'var(--frame)',
        right: 'var(--frame)',
        bottom: 'var(--frame)',
        left: 'var(--frame)',
        borderRadius: 'var(--shell-radius)',
      }}
    >
      <Liquid />

      {/* The aurora proper — enormous, bleeding off the top edge, and scrolling
          away with the page rather than hanging over every section. */}
      <div
        className="absolute inset-x-0 top-0 h-[88vh]"
        style={{
          transform: `translate3d(0, ${-lift}px, 0)`,
          opacity: fade,
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="absolute inset-0 animate-drift"
          style={{
            background: [
              'radial-gradient(52% 64% at 14% -6%, rgba(150,195,255,0.85) 0%, rgba(78,135,245,0.4) 32%, rgba(40,80,200,0.14) 58%, transparent 76%)',
              'radial-gradient(44% 56% at 76% -12%, rgba(150,120,255,0.42) 0%, rgba(70,60,190,0.14) 46%, transparent 72%)',
              /*
               * The one warm note up here. Magenta bleeding into the cold
               * bodies is the clash the Vice City art lives on — kept to a
               * corner and a sixth of the opacity of the blue, so it reads
               * as a tint on the light rather than a second light.
               */
              'radial-gradient(34% 40% at 92% -10%, rgba(255,72,158,0.26) 0%, rgba(214,58,150,0.08) 44%, transparent 70%)',
              'radial-gradient(26% 32% at 34% -14%, rgba(225,242,255,0.6) 0%, transparent 68%)',
              'radial-gradient(90% 46% at 50% -24%, rgba(60,110,230,0.3) 0%, transparent 70%)',
            ].join(', '),
            filter: 'blur(22px)',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Settles everything back down into the dark. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,9,12,0) 0%, rgba(8,9,12,0.42) 34%, rgba(5,6,8,0.84) 68%, rgba(3,4,6,0.94) 100%)',
        }}
      />

      {/*
        A sun that already set. Laid over the darkening pass, not under it,
        or it would be crushed to nothing — but at this opacity it only warms
        the black near the bottom edge and never resolves into a shape. The
        teal on the left is what keeps it from reading as plain orange glow:
        warm horizon against cool shadow is the whole Vice City move.
      */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(128% 40% at 54% 114%, rgba(255,116,58,0.17) 0%, rgba(255,64,132,0.1) 36%, transparent 68%)',
            'radial-gradient(72% 26% at 6% 104%, rgba(26,196,190,0.09) 0%, transparent 72%)',
          ].join(', '),
        }}
      />

      {/* The live accent, taken from whatever card is under the cursor. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(76% 52% at 50% 4%, rgb(var(--accent) / 0.16) 0%, transparent 64%)',
          transition: 'background 900ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Film grain, so the huge flat blacks never band. */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
