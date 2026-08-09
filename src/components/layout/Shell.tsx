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
          backdropFilter: 'blur(18px) saturate(185%) brightness(1.06)',
          WebkitBackdropFilter: 'blur(18px) saturate(185%) brightness(1.06)',
          // Wet white film — thickest at the very edge, gone by the frame.
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 42%, rgba(255,255,255,0.3) 58%, rgba(255,255,255,0.48) 100%)',
          maskImage: RIM,
          WebkitMaskImage: RIM,
          transform: 'translateZ(0)',
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
 * The surface inside the frame. Held a clear step below the cards in value so
 * the glass has something to actually refract, and kept alive by the liquid.
 */
export function Backdrop() {
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

      {/* Settles the liquid back toward the surface colour. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(235,236,240,0.32) 0%, rgba(235,236,240,0.6) 46%, rgba(228,229,234,0.72) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(78% 58% at 50% 6%, rgb(var(--accent) / 0.09) 0%, transparent 66%)',
          transition: 'background 900ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </div>
  );
}
