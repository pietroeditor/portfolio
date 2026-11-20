import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Entrance, in CSS.
 *
 * The pane comes forward out of the dark along the same axis the scroll
 * depth works on, so arriving and scrolling feel like one space.
 *
 * Deliberately not an animation-library variant: the library writes
 * `transform` as an inline style, which cannot coexist with the depth
 * transform on the same element, and a plain class is the only version whose
 * having-run I can actually check in the DOM.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Milliseconds behind its neighbours, for a staggered row. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
