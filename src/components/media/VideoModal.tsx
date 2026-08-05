import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { HOLD, transitions } from '@/lib/motion';
import type { Project } from '@/types';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

const FOCUSABLE = 'button, iframe, [href], [tabindex]:not([tabindex="-1"])';

function embedUrl(youtubeId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    start: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    color: 'white',
  });
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

/** House lights down. Hard cut in, the room takes the project's colour. */
export function VideoModal({ project, onClose }: VideoModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restore = useRef<HTMLElement | null>(null);

  const open = Boolean(project);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    return () => {
      const t = restore.current;
      if (t && document.contains(t)) t.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const { documentElement: html, body } = document;
    const prev = { h: html.style.overflow, b: body.style.overflow };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev.h;
      body.style.overflow = prev.b;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const lastEl = nodes[nodes.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const backdrop = useCallback(() => onClose(), [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: transitions.cutOut }}
          transition={transitions.cut}
        >
          <motion.div
            aria-hidden
            onClick={backdrop}
            className="absolute inset-0 bg-desk/[0.72] backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: transitions.cutOut }}
            transition={transitions.cut}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(46% 40% at 50% 46%, rgb(var(--accent) / 0.26) 0%, rgb(var(--accent) / 0.07) 46%, transparent 74%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: HOLD }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — video`}
            className="relative w-full max-w-[min(100%,80rem,calc((100dvh_-_10rem)_*_16_/_9))]"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.9, y: 44, filter: 'blur(26px)' }
            }
            animate={
              reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
            }
            exit={{
              opacity: 0,
              scale: 1.06,
              filter: 'blur(18px)',
              transition: { duration: 0.24, ease: [0.7, 0, 0.84, 0] },
            }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: HOLD }}
          >
            <div
              className="relative aspect-video w-full overflow-hidden rounded-card bg-black"
              style={{
                boxShadow:
                  '0 0 0 1px rgba(10,10,11,0.1), 0 0 100px -24px rgb(var(--accent) / 0.55), 0 30px 60px -30px rgba(10,10,11,0.4), 0 70px 120px -60px rgba(10,10,11,0.5)',
              }}
            >
              <iframe
                key={project.id}
                src={embedUrl(project.youtubeId ?? '')}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-cardTitle">{project.title}</span>
              <span aria-hidden className="h-3 w-px bg-line" />
              <span className="text-meta font-medium text-muted">{project.format}</span>
              <span aria-hidden className="h-3 w-px bg-line" />
              <span className="text-meta text-faint">{project.runtime}</span>
            </div>
          </motion.div>

          <motion.div
            className="fixed z-[160]"
            style={{
              top: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
              right: 'calc(env(safe-area-inset-right, 0px) + 1rem)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: transitions.cutOut }}
            transition={{ ...transitions.element, delay: HOLD * 2 }}
          >
            <button
              type="button"
              ref={closeRef}
              onClick={onClose}
              aria-label="Close video"
              className="glass glass-edge relative grid h-12 w-12 place-items-center rounded-full text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                <path d="M2 2L13 13M13 2L2 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
