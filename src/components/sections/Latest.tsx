import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { Glow } from '@/components/ui/Glow';
import { GameMark } from '@/components/ui/GameMark';
import { latestWork } from '@/data/latest';
import type { Reel } from '@/types';

/**
 * Only one clip is ever allowed to carry sound. Held outside React so turning
 * one up costs nothing anywhere else — two DOM calls, no re-render.
 */
let audible: HTMLVideoElement | null = null;

/**
 * Fired on `window` when a clip gives the sound up, so a clip that is already
 * on screen can take it without waiting for a scroll to re-trigger its own
 * observer — leaving the band is not an event for the clip that stayed.
 */
const RELEASED = 'reel:released';

/** Halfway between half and silent — present without being imposed. */
const CLIP_VOLUME = 0.25;

/** How far a clip's middle sits from the middle of the screen. */
function offCentre(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  return Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
}

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
function Highlight({ skill }: { skill: Reel }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(true);
  /** True once the browser has refused to let the clip speak unprompted. */
  const [blocked, setBlocked] = useState(false);
  /**
   * Set once the visitor presses the button to mute this clip. Focus hands
   * the sound around on its own, but it must never hand it back to someone
   * who has already said no.
   */
  const silenced = useRef(false);

  /** Whether this clip is currently crossing the reading band. */
  const inBand = useRef(false);

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
     * Sound belongs to whichever clip is on screen. Taking focus takes the
     * sound off whoever had it, so two clips can never talk over each other
     * however fast the page is scrolled.
     *
     * Browsers only allow this once the visitor has interacted with the page,
     * so: try it loud; if the attempt is refused, fall back to muted and light
     * the button up. The picture always runs either way.
     */
    const start = async () => {
      if (audible && audible !== video && audible.isConnected) {
        /*
         * Two clips can both reach the band at once on a tall screen, and
         * whoever's observer fired last would win — which is not the one
         * being looked at. The nearer middle takes it; the other still gets
         * its picture, just silently.
         */
        if (offCentre(audible) <= offCentre(video)) {
          video.muted = true;
          setSound(false);
          void video.play().catch(() => {});
          return;
        }
        audible.muted = true;
        audible.dispatchEvent(new CustomEvent('silenced'));
      }
      audible = video;

      // Someone who muted this clip by hand gets the picture and nothing else.
      if (silenced.current) {
        video.muted = true;
        void video.play().catch(() => {});
        return;
      }

      video.muted = false;
      try {
        await video.play();
        // `play()` resolves a frame or two later, and the clip below can take
        // the sound in that gap — it mutes this element directly, so claiming
        // the state here from what was true before the await is how the
        // button ends up reading "Sound on" over a silent clip.
        if (audible !== video) return;
        setSound(true);
        setBlocked(false);
      } catch {
        video.muted = true;
        setSound(false);
        if (audible === video) setBlocked(true);
        // Muted playback is never refused, so the picture still runs.
        void video.play().catch(() => {});
      }
    };

    /** Out of focus: no picture, no sound, and no claim on the sound either. */
    const leave = () => {
      video.pause();
      video.muted = true;
      setSound(false);
      if (audible === video) {
        audible = null;
        // The clip that stayed in the band gets no observer callback of its
        // own, so without this it would sit there silent with the sound going
        // spare until the next scroll moved something across the boundary.
        window.dispatchEvent(new CustomEvent(RELEASED));
      }
    };

    /**
     * Focus is the middle band of the screen, not "anywhere on it" — on a tall
     * display both clips are well over 40% visible at the same time. Even the
     * middle 30% can hold two of them at once, which is what the centre test
     * in `start` is for; this just keeps a clip at the edge of the screen from
     * ever being a candidate.
     */
    const io = new IntersectionObserver(
      (entries) => {
        inBand.current = entries.some((e) => e.isIntersecting);
        if (inBand.current) void start();
        else leave();
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    );

    io.observe(el);

    /** Whoever is still on screen picks the sound up when it is let go. */
    const onReleased = () => {
      if (inBand.current && !audible) void start();
    };
    window.addEventListener(RELEASED, onReleased);

    /**
     * One gesture — anywhere, once — is all the browser is waiting for.
     *
     * Guarded on the singleton rather than on this clip's own blocked flag:
     * with more than one clip on the page every blocked clip would answer the
     * same click and they would all start talking at once. Only the one that
     * currently holds focus gets to.
     */
    const onGesture = () => {
      if (audible !== video || silenced.current || video.paused) return;
      if (!video.muted) return;
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
      window.removeEventListener(RELEASED, onReleased);
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

    // An explicit mute outranks focus; asking for sound takes the refusal back.
    silenced.current = !next;

    video.muted = !next;
    setSound(next);
    setBlocked(false);
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
            The game, in the corner diagonally opposite the sound control, so
            the two marks balance the frame and neither lands on the title.
            It wears the same travelling light as the Latest tab: no label,
            nothing to read — it says what this is at a glance and then gets
            out of the way of the clip.
          */}
          <div className="plate pointer-events-none absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-[1rem] text-white sm:h-14 sm:w-14 sm:rounded-[1.15rem]">
            <GameMark game={skill.game} />
          </div>

          {/*
            Whenever the sound is off — refused by the browser or switched off
            by hand — this wears the same orbiting ring as the Latest tab in
            the dock. Nothing else on the page carries that mark, so it reads
            as the one thing asking to be pressed.

            This is what the ten-second silence was: the browser will not let
            a clip speak before the visitor has touched the page, so the sound
            arrived whenever they happened to click something. Now the control
            that fixes it is impossible to miss.
          */}
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? 'Mute clip' : 'Unmute clip'}
            className={cn(
              'absolute right-3 top-3 flex items-center gap-2 rounded-full py-2.5 pl-3 pr-3.5 text-[0.8125rem] font-semibold tracking-[-0.01em] transition-transform duration-300 ease-drift hover:scale-[1.04] active:scale-95',
              sound ? 'glass text-ink' : 'new-ring isolate text-ink',
            )}
          >
            <Speaker on={sound} />
            <span>{blocked ? 'Tap for sound' : sound ? 'Sound on' : 'Sound off'}</span>
          </button>
        </div>

        {/*
          The title and nothing else. Burned over the frame where there is
          room for it, stacked underneath where there is not — a phone's 16:9
          box is shorter than this block, so overlaying it there would clip
          the title off the top.
        */}
        <div className="px-2 pb-1 pt-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-5">
          <h3 className="max-w-[22ch] text-balance font-serif text-[clamp(1.5rem,3.1vw,2.5rem)] font-normal leading-[1.06] tracking-[-0.022em]">
            {skill.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export function Latest() {
  return (
    <section id="latest" className="relative pb-bay">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {/*
            A label, not an argument — the clips are the case. Left unlit on
            purpose: the reference alternates, and two accented headings in a
            row would leave the colour meaning nothing.
          */}
          <motion.div variants={riseIn}>
            <span className="eyebrow">Latest</span>
            <h1 className="mt-5 max-w-[18ch] text-balance font-serif text-title">Recent work.</h1>
          </motion.div>

          {/*
            Stacked, every one at full width. These are the pieces the section
            exists to show — halving one to balance a grid would be trading
            the work for the layout.
          */}
          <div className="mt-block flex flex-col gap-6 lg:gap-8">
            {latestWork.map((skill) => (
              <motion.div key={skill.id} variants={riseIn}>
                <div data-depth className="depth-item">
                  <Highlight skill={skill} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
