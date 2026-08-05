import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { PaintFill } from '@/components/ui/PaintFill';
import type { Project } from '@/types';

/**
 * Only one preview is ever allowed to run. Held outside React so switching
 * cards costs nothing — no state, no re-render, just two DOM calls.
 */
let activePreview: HTMLVideoElement | null = null;

function halt(video: HTMLVideoElement) {
  video.style.opacity = '0';
  video.pause();
  video.currentTime = 0;
}

interface WorkGridProps {
  projects: readonly Project[];
  onOpen: (project: Project) => void;
  onHover: (project: Project) => void;
}

/**
 * Card, built to the reference proportions: generous even padding, an inset
 * thumbnail with its own radius, a runtime chip in the corner, a heavy
 * two-line title, and a full-width footer bar sitting a step off the body.
 *
 * At rest the card is almost nothing. On hover white floods up through it.
 */
function Card({
  project,
  eager,
  onOpen,
  onHover,
  autoPlay,
}: {
  project: Project;
  eager: boolean;
  onOpen: (p: Project) => void;
  onHover: (p: Project) => void;
  /** Touch devices only — driven by which card is centred in the viewport. */
  autoPlay: boolean;
}) {
  const [lit, setLit] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Tracked in a ref so a late `playing` event can't reveal a stale preview. */
  const wanted = useRef(false);

  const startPreview = useCallback(() => {
    wanted.current = true;

    const video = videoRef.current;
    if (!video) return;

    if (activePreview && activePreview !== video) halt(activePreview);
    activePreview = video;

    video.currentTime = 0;
    // Rejected autoplay just means the thumbnail stays — nothing to recover.
    void video.play().catch(() => {});
  }, []);

  const stopPreview = useCallback(() => {
    wanted.current = false;

    const video = videoRef.current;
    if (!video) return;
    if (activePreview === video) activePreview = null;
    halt(video);
  }, []);

  const enter = useCallback(() => {
    setLit(true);
    onHover(project);
    startPreview();
  }, [onHover, project, startPreview]);

  const leave = useCallback(() => {
    setLit(false);
    stopPreview();
  }, [stopPreview]);

  /**
   * Touch path. Runs only when this card takes the centre, and tears down when
   * it loses it — so a card that stays centred is never restarted, and desktop
   * (where `autoPlay` is permanently false) never enters this branch at all.
   */
  useEffect(() => {
    if (!autoPlay) return;
    startPreview();
    return stopPreview;
  }, [autoPlay, startPreview, stopPreview]);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className="group glass-quiet relative block w-full overflow-hidden rounded-[1.5rem] p-3 text-left transition-transform duration-500 ease-drift hover:-translate-y-1"
    >
      <PaintFill active={lit} />

      {/* Thumbnail */}
      <span className="relative block overflow-hidden rounded-[0.875rem]">
        <img
          src={project.media.poster}
          alt={project.media.alt}
          loading={eager ? 'eager' : 'lazy'}
          className="aspect-video w-full scale-[1.02] object-cover transition-transform duration-[900ms] ease-drift group-hover:scale-[1.06]"
        />
        {/*
          The preview sits over the still and is revealed only once frames are
          actually decoding, so the crossfade never lands on an empty element.
          It carries the same zoom as the thumbnail to stay registered with it.
        */}
        {project.media.video && (
          <video
            ref={videoRef}
            src={project.media.video}
            poster={project.media.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            tabIndex={-1}
            disablePictureInPicture
            onPlaying={() => {
              if (wanted.current && videoRef.current) videoRef.current.style.opacity = '1';
            }}
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-drift group-hover:scale-[1.06]"
            style={{ transitionDuration: '240ms, 900ms' }}
          />
        )}

        <span
          aria-hidden
          className="absolute inset-0 rounded-[0.875rem]"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(10,10,11,0.1)' }}
        />

        {/* Runtime chip */}
        <span className="absolute bottom-2.5 right-2.5 rounded-[0.5rem] bg-black/80 px-2.5 py-[0.3rem] text-[0.9375rem] font-bold leading-none tracking-[-0.01em] text-white backdrop-blur-md">
          {project.runtime}
        </span>
      </span>

      {/* Title */}
      <span className="relative block px-1 pb-3.5 pt-3.5 text-cardTitle">{project.title}</span>

      {/* Footer bar */}
      <span
        className="relative flex items-center justify-between gap-3 rounded-[0.75rem] px-3.5 py-3 transition-colors duration-[620ms] ease-drift"
        style={{
          background: lit ? 'rgba(10,10,11,0.055)' : 'rgba(255,255,255,0.34)',
          boxShadow: 'inset 0 0 0 1px rgba(10,10,11,0.05)',
        }}
      >
        <span className="truncate text-[0.9375rem] font-semibold tracking-[-0.012em] text-muted">
          {project.format}
        </span>
        <span className="shrink-0 text-[0.9375rem] font-bold tracking-[-0.012em] text-ink transition-transform duration-300 group-hover:translate-x-0.5">
          Watch
        </span>
      </span>
    </button>
  );
}

/** A card counts as centred while its middle sits inside the middle 70%. */
const CENTRE_REACH = 0.35;

export function WorkGrid({ projects, onOpen, onHover }: WorkGridProps) {
  const [centred, setCentred] = useState<string | null>(null);
  const nodes = useRef(new Map<string, HTMLElement>());

  /**
   * Touch devices drive the preview from scroll position instead of hover.
   *
   * The election has to be re-run continuously, not on crossing events: two
   * cards can both sit near the middle and swap which one is closest without
   * either entering or leaving anything, which is how an active card gets
   * stuck. So the IntersectionObserver only maintains the candidate set — the
   * cards actually on screen — and a scroll listener throttled to one
   * animation frame measures those few and picks the closest to centre.
   */
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let observer: IntersectionObserver | null = null;
    let frame = 0;
    const onScreen = new Set<string>();

    const measure = () => {
      frame = 0;

      const middle = window.innerHeight / 2;
      const reach = window.innerHeight * CENTRE_REACH;
      let best: string | null = null;
      let bestDistance = Infinity;

      onScreen.forEach((id) => {
        const el = nodes.current.get(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = id;
        }
      });

      // Nothing close enough to the middle — every preview goes back to rest.
      if (bestDistance > reach) best = null;

      // A card that stays elected never re-renders, so it never restarts.
      setCentred((prev) => (prev === best ? prev : best));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const teardown = () => {
      observer?.disconnect();
      observer = null;
      onScreen.clear();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      setCentred(null);
    };

    const setup = () => {
      // Desktop keeps hover and nothing else.
      if (fine.matches) return teardown();
      if (observer) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = (entry.target as HTMLElement).dataset.projectId;
            if (!id) return;
            if (entry.isIntersecting) onScreen.add(id);
            else onScreen.delete(id);
          });
          schedule();
        },
        { threshold: 0 },
      );

      nodes.current.forEach((el) => observer?.observe(el));
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      // Elect on arrival, so the first centred card plays without a scroll.
      schedule();
    };

    setup();
    fine.addEventListener('change', setup);
    return () => {
      fine.removeEventListener('change', setup);
      teardown();
    };
  }, []);

  const register = useCallback((id: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el);
    else nodes.current.delete(id);
  }, []);

  return (
    <section id="work" className="relative pb-bay pt-6">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.h1 variants={riseIn} className="max-w-[20ch] text-balance text-title">
            Six cuts that explain how I think.
          </motion.h1>

          <div className="mt-block grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <motion.article
                key={project.id}
                variants={riseIn}
                ref={register(project.id)}
                data-project-id={project.id}
              >
                <Card
                  project={project}
                  eager={i < 3}
                  onOpen={onOpen}
                  onHover={onHover}
                  autoPlay={centred === project.id}
                />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
