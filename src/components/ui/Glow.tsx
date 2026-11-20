import { useEffect, useRef } from 'react';

/**
 * Hover glow.
 *
 * Drops into a card the way the old paint fill did — one self-contained child,
 * no props, no state — but nothing here floods or masks. A rim lights along
 * the top edge and a bloom follows the cursor across the pane, both driven by
 * the parent's `:hover` in CSS, so hovering a card costs no React render.
 *
 * The parent must carry `group` and `position: relative`.
 */
export function Glow() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;

    // Touch has no cursor to follow; the rim alone carries the state there.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    /**
     * The tilt belongs to the depth pane, not to the card: that element owns
     * the transform, and the two angles simply add into the one it already
     * builds from the scroll. CSS eases them back to zero on its own.
     */
    const pane = host.closest<HTMLElement>('.depth-item');

    const move = (e: PointerEvent) => {
      const box = host.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      host.style.setProperty('--gx', `${x}px`);
      host.style.setProperty('--gy', `${y}px`);

      if (!pane || !box.width || !box.height) return;
      // -1..1 from the centre of the card, turned into a few degrees.
      const nx = (x / box.width) * 2 - 1;
      const ny = (y / box.height) * 2 - 1;
      pane.style.setProperty('--tx', `${(-ny * 4.5).toFixed(2)}deg`);
      pane.style.setProperty('--ty', `${(nx * 5.5).toFixed(2)}deg`);
    };

    const rest = () => {
      if (!pane) return;
      pane.style.setProperty('--tx', '0deg');
      pane.style.setProperty('--ty', '0deg');
    };

    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', rest);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', rest);
      rest();
    };
  }, []);

  return (
    <>
      <span ref={ref} aria-hidden className="glow-bloom" />
      <span aria-hidden className="glow-rim" />
    </>
  );
}
