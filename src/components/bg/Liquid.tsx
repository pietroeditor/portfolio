import { useEffect, useRef } from 'react';

/**
 * Interactive liquid.
 *
 * A handful of soft colour bodies drift on their own paths and one of them
 * trails the cursor. Drawn additively into a canvas, then blurred hard by CSS,
 * which is what turns overlapping circles into a single flowing fluid rather
 * than a group of blobs.
 */

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: [number, number, number];
}

/**
 * Cold only. On black these read as the aurora moving rather than as blobs
 * of colour, which is the whole point — a warm body here looks like a bug.
 */
const PALETTE: [number, number, number][] = [
  [86, 150, 255],
  [122, 108, 255],
  [115, 198, 254],
  [64, 96, 220],
  [168, 205, 255],
];

export function Liquid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0.5, y: 0.35, tx: 0.5, ty: 0.35, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      // Half-resolution buffer: it is blurred to nothing anyway.
      dpr = Math.min(1, window.devicePixelRatio || 1) * 0.5;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    resize();
    window.addEventListener('resize', resize);

    const bodies: Body[] = PALETTE.map((hue, i) => ({
      x: 0.2 + (i % 3) * 0.3,
      y: 0.2 + Math.floor(i / 3) * 0.4,
      vx: (i % 2 ? 1 : -1) * (0.00006 + i * 0.000018),
      vy: (i % 3 ? -1 : 1) * (0.00005 + i * 0.000014),
      r: 0.34 + (i % 3) * 0.11,
      hue,
    }));

    const onPointer = (e: PointerEvent) => {
      pointer.current.tx = e.clientX / window.innerWidth;
      pointer.current.ty = e.clientY / window.innerHeight;
      pointer.current.active = true;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let raf = 0;
    let prev = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(48, now - prev);
      prev = now;

      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const min = Math.min(w, h);

      bodies.forEach((b, i) => {
        if (!reduce) {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.x < -0.2 || b.x > 1.2) b.vx *= -1;
          if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;
        }

        // The first body is the cursor; the rest lean gently toward it.
        const pull = i === 0 ? 1 : 0.12 / i;
        const cx = (b.x + (p.x - b.x) * pull) * w;
        const cy = (b.y + (p.y - b.y) * pull) * h;
        const radius = b.r * min;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const [r, gg, bl] = b.hue;
        g.addColorStop(0, `rgba(${r},${gg},${bl},0.32)`);
        g.addColorStop(0.55, `rgba(${r},${gg},${bl},0.1)`);
        g.addColorStop(1, `rgba(${r},${gg},${bl},0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ filter: 'blur(64px) saturate(1.35)', opacity: 0.7 }}
    />
  );
}
