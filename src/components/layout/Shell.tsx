import { Liquid } from '@/components/bg/Liquid';

/** The visible edge of the object. Drawn over everything, never interactive. */
export function Shell() {
  return (
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
