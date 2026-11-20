import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { Glow } from '@/components/ui/Glow';
import { aiSkills } from '@/data/aiSkills';
import type { AiSkill } from '@/types';

/**
 * Only one clip is ever allowed to carry sound. Held outside React so turning
 * one up costs nothing anywhere else — two DOM calls, no re-render.
 */
let audible: HTMLVideoElement | null = null;

/** Halfway between half and silent — present without being imposed. */
const CLIP_VOLUME = 0.25;

function Speaker({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden fill="none">
      <path
        d="M4 7.6h2.6L10.2 4v12L6.6 12.4H4a.9.9 0 0 1-.9-.9V8.5a.9.9 0 0 1 .9-.9Z"
        fill="currentColor"
      />
      {on ? (
        <>
          <path
            d="M13.1 7.1a4 4 0 0 1 0 5.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15.4 4.8a7.2 7.2 0 0 1 0 10.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M13.4 7.8 17 11.4M17 7.8l-3.6 3.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * A highlight. The clip runs on its own the moment enough of the card is on
 * screen and stops the moment it leaves, so the section is alive without ever
 * having more than a couple of decoders awake at once.
 *
 * Title and tag are burned over the frame rather than set beneath it — these
 * are reels, not catalogue entries, and the frame should read as the work.
 */
function Highlight({ skill, hero }: { skill: AiSkill; hero: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(true);
  /** True once the browser has refused to let the clip speak unprompted. */
  const [blocked, setBlocked] = useState(false);
  /** Read by a listener registered once, so it never closes over stale state. */
  const blockedRef = useRef(false);
  blockedRef.current = blocked;

  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el || !video) return;

    /**
     * A clip that speaks without being asked has to speak quietly. A quarter
     * of system volume is the level that carries the mix on a laptop without
     * making anyone reach for the keyboard — and the control to kill it sits
     * in the corner of the frame either way.
     */
    video.volume = CLIP_VOLUME;

    /**
     * Sound is on by default, which browsers only allow once the visitor has
     * interacted with the page. So: try it loud; if the attempt is refused,
     * fall back to muted, light the button up, and take the first gesture
     * anywhere on the page as permission to turn it back on.
     */
    const start = async () => {
      if (audible && audible !== video) {
        audible.muted = true;
        audible.dispatchEvent(new CustomEvent('silenced'));
      }
      audible = video;

      video.muted = false;
      try {
        await video.play();
        setSound(true);
        setBlocked(false);
      } catch {
        video.muted = true;
        setSound(false);
        setBlocked(true);
        // Muted playback is never refused, so the picture still runs.
        void video.play().catch(() => {});
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void start();
        else video.pause();
      },
      { threshold: 0.4 },
    );

    io.observe(el);

    // One gesture — anywhere, once — is all the browser is waiting for.
    const onGesture = () => {
      if (!blockedRef.current || video.paused) return;
      video.muted = false;
      setSound(true);
      setBlocked(false);
    };
    window.addEventListener('pointerdown', onGesture);
    window.addEventListener('keydown', onGesture);

    return () => {
      io.disconnect();
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      // Leaving with the sound on would strand the singleton on a dead node.
      if (audible === video) audible = null;
    };
  }, []);

  /**
   * The element is the source of truth, not the state — handing the singleton
   * around inside a state updater would run twice under StrictMode and leave
   * two clips audible.
   */
  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const next = video.muted;

    if (next) {
      if (audible && audible !== video) {
        audible.muted = true;
        audible.dispatchEvent(new CustomEvent('silenced'));
      }
      audible = video;
    } else if (audible === video) {
      audible = null;
    }

    video.muted = !next;
    setSound(next);
  }, []);

  /** Another card taking the sound has to be reflected in this one's button. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onSilenced = () => setSound(false);
    video.addEventListener('silenced', onSilenced);
    return () => video.removeEventListener('silenced', onSilenced);
  }, []);

  return (
    <div
      ref={ref}
      className="group glass-quiet relative overflow-hidden rounded-[1.5rem] p-2 transition-transform duration-500 ease-drift hover:-translate-y-1"
    >
      <Glow />

      <div className="relative">
        <div className="relative overflow-hidden rounded-[1.1rem]">
          <video
            ref={videoRef}
            src={skill.media.video}
            poster={skill.media.poster}
            aria-label={skill.media.alt}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            /*
              No push-in on hover. The card already tilts under the cursor,
              and a frame that zooms at the same time reads as two separate
              things moving — the tilt is the response, this just held still.
              The 1% is a static overscan so the edges never show a seam.
            */
            className="aspect-video w-full scale-[1.01] object-cover"
          />

          {/*
            Scrim. Only drawn where the type is actually burned in — on a phone
            the copy sits below the frame, so darkening it there buys nothing
            and only costs the clip two stops.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[62%] sm:block"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,0.88) 100%)',
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.1rem]"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
          />

          {/*
            The model, burned into the frame diagonally opposite the sound
            control so the two corner marks balance and neither lands on the
            title. One line, the height of that button — a credit, not a
            panel. It belongs to the clip, so it rides every transform the
            card takes instead of sitting in the page beside it.
          */}
          <div className="opus-plate pointer-events-none absolute bottom-4 right-4 flex items-center gap-3 rounded-full py-2 pl-2 pr-4 sm:gap-3.5 sm:py-2.5 sm:pl-2.5 sm:pr-5">
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full sm:h-10 sm:w-10"
              style={{
                background: 'linear-gradient(150deg, #ffffff 0%, #9FD6FF 42%, #73C6FE 100%)',
                boxShadow:
                  '0 0 26px -2px rgba(115,198,254,1), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              <svg
                viewBox="0 0 16 16"
                width="19"
                height="19"
                fill="none"
                stroke="#07090E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6.6 2.2c0 2.5 1.3 3.8 3.8 3.8-2.5 0-3.8 1.3-3.8 3.8 0-2.5-1.3-3.8-3.8-3.8 2.5 0 3.8-1.3 3.8-3.8Z" />
                <path d="M11.8 9.6c0 1.2.6 1.8 1.8 1.8-1.2 0-1.8.6-1.8 1.8 0-1.2-.6-1.8-1.8-1.8 1.2 0 1.8-.6 1.8-1.8Z" />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="font-mono text-[0.5625rem] uppercase leading-none tracking-[0.22em] text-white/60 sm:text-[0.625rem]">
                Built with
              </span>
              <span className="opus-word mt-1.5 text-[1.0625rem] font-bold leading-none tracking-[-0.022em] sm:text-[1.3125rem]">
                Opus 5
              </span>
            </span>
          </div>

          {/*
            Prominent on purpose: the clip starts loud, so the way out of it
            has to be the most obvious control on the card. When the browser
            has refused the sound it pulses instead, asking for the one click
            that is all it needs.
          */}
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? 'Mute clip' : 'Unmute clip'}
            className="glass absolute right-3 top-3 flex items-center gap-2 rounded-full py-2.5 pl-3 pr-3.5 text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink transition-transform duration-300 ease-drift hover:scale-[1.04] active:scale-95"
            style={
              blocked
                ? { animation: 'beg-for-sound 1.7s ease-in-out infinite', color: '#cdeaff' }
                : undefined
            }
          >
            <Speaker on={sound} />
            <span>{blocked ? 'Tap for sound' : sound ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>

        {/*
          Burned over the frame where there is room for it, stacked underneath
          where there is not. A phone's 16:9 box is shorter than this block, so
          overlaying it there just clips the title off the top.
        */}
        <div className="px-2 pb-1 pt-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-5">
          <span className="eyebrow">{skill.tag}</span>
          <h3
            className={
              hero
                ? 'mt-2.5 max-w-[22ch] text-balance font-serif text-[clamp(1.5rem,3.1vw,2.5rem)] font-normal leading-[1.06] tracking-[-0.022em]'
                : 'mt-2.5 max-w-[22ch] text-balance font-serif text-[clamp(1.35rem,2.1vw,1.9rem)] font-normal leading-[1.08] tracking-[-0.02em]'
            }
          >
            {skill.title}
          </h3>
          {hero && (
            <p className="mt-2.5 max-w-prose text-pretty text-body text-muted">{skill.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AiSkills() {
  return (
    <section id="ai" className="relative pb-bay">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div variants={riseIn}>
            <span className="eyebrow">AI skills</span>
            <h2 className="mt-5 max-w-[18ch] text-balance font-serif text-title">
              Effects I build <span className="lit">with AI</span>.
            </h2>
            <p className="mt-5 max-w-prose text-pretty text-lead text-muted">
              Generated performance, composited by hand. The tool is new — the cut, the timing and
              the sound are the same job they always were.
            </p>
          </motion.div>

          {/* First highlight carries the row; the rest fall in two-up beside it. */}
          <div className="mt-block grid gap-5 lg:grid-cols-2">
            {aiSkills.map((skill, i) => (
              <motion.div
                key={skill.id}
                variants={riseIn}
                className={i === 0 ? 'lg:col-span-2' : undefined}
              >
                <div data-depth className="depth-item">
                  <Highlight skill={skill} hero={i === 0} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
