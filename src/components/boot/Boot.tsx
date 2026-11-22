import { useCallback, useEffect, useRef, useState } from 'react';

import { playBootSound } from '@/lib/bootSound';
import { lockScroll } from '@/lib/scrollLock';

/**
 * Power-on.
 *
 * A dead tube strikes, opens, runs its checks and hands the screen over. The
 * whole thing is four states on timers — no scroll, no observers, nothing to
 * wedge — and any click or key cuts straight to the end.
 *
 * It plays once per tab. A boot sequence you cannot get past is a door that
 * sticks, so `?boot=1` forces it for a demo and `?boot=0` skips it outright.
 */

type Phase = 'strike' | 'open' | 'post' | 'brand' | 'cut' | 'gone';

const SEEN = 'pietro:booted';

/** The checks, in the order a machine this old would actually run them. */
const POST = [
  'PIETRO SYSTEMS — EDIT BAY',
  'MEMORY ......... 65536 OK',
  'TIMELINE ....... MOUNTED',
  'CODEC H.264 / PRORES 422',
  'RENDER ENGINE .. READY',
  '6 CUTS ON DISK. 2 NEW REELS.',
] as const;

/** Where each phase hands over, in milliseconds from power-on. */
const AT: Record<Exclude<Phase, 'gone'>, number> = {
  strike: 0,
  open: 460,
  post: 900,
  brand: 2560,
  cut: 3500,
};

function shouldPlay(): boolean {
  if (typeof window === 'undefined') return false;
  const forced = new URLSearchParams(window.location.search).get('boot');
  if (forced === '1') return true;
  if (forced === '0') return false;
  try {
    return window.sessionStorage.getItem(SEEN) !== '1';
  } catch {
    // Private mode with storage denied still deserves to see it once.
    return true;
  }
}

export function Boot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase | null>(null);
  const timers = useRef<number[]>([]);
  const finished = useRef(false);

  /** Hands the screen over exactly once, however we got here. */
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    try {
      window.sessionStorage.setItem(SEEN, '1');
    } catch {
      /* nothing to remember it with — it just plays again next tab */
    }
    setPhase('cut');
    // Tracked like the rest, so unmounting mid-cut cancels it too.
    timers.current.push(
      window.setTimeout(() => {
        setPhase('gone');
        onDone();
      }, 620),
    );
  }, [onDone]);

  /** True only while the tube is still on screen. */
  const covering = phase !== null && phase !== 'gone';

  /**
   * The page underneath must not move while the tube is warming — and must
   * move again the moment it is gone.
   *
   * Keyed on `covering`, not held in the effect that runs the sequence. That
   * effect's dependencies never change and this component is never unmounted,
   * so its cleanup never ran and the body kept `overflow: hidden` for the
   * rest of the visit. Programmatic scrolling still worked, which is why the
   * dock went on jumping between sections — only the wheel and the trackpad
   * were dead, and only on the first load of a tab, since the intro plays
   * once per session.
   */
  useEffect(() => {
    if (!covering) return;
    return lockScroll();
  }, [covering]);

  /**
   * The sound rides the same flag as the lock, for the same reason: skipping
   * the intro has to take the audio with it, and the effect that runs the
   * sequence never cleans up. Starting it here also means it is started once
   * per appearance of the tube, not once per mount.
   */
  useEffect(() => {
    if (!covering) return;
    return playBootSound();
  }, [covering]);

  useEffect(() => {
    if (!shouldPlay()) {
      setPhase('gone');
      onDone();
      return;
    }

    setPhase('strike');

    const at = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    at(AT.open, () => setPhase('open'));
    at(AT.post, () => setPhase('post'));
    at(AT.brand, () => setPhase('brand'));
    at(AT.cut, finish);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [finish, onDone]);

  useEffect(() => {
    if (!phase || phase === 'gone') return;
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [phase, finish]);

  if (!phase || phase === 'gone') return null;

  const open = phase !== 'strike';
  const showPost = phase === 'post' || phase === 'brand' || phase === 'cut';
  const showBrand = phase === 'brand' || phase === 'cut';

  return (
    <div
      className="fixed inset-0 z-[200] bg-black"
      role="status"
      aria-live="polite"
      aria-label="Starting up"
    >
      {/* The seam of light the gun opens with, before there is any picture. */}
      {phase === 'strike' && (
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-[2px] origin-center"
          style={{
            background: 'linear-gradient(90deg, transparent, #eaf7ff 18%, #fff 50%, #eaf7ff 82%, transparent)',
            boxShadow: '0 0 24px 6px rgba(150,214,255,0.85), 0 0 90px 18px rgba(115,198,254,0.45)',
            animation: 'boot-seam 460ms cubic-bezier(0.7,0,0.3,1) forwards',
          }}
        />
      )}

      {open && (
        <div
          className="absolute inset-0 origin-center overflow-hidden"
          style={{
            animation:
              phase === 'cut'
                ? 'boot-collapse 620ms cubic-bezier(0.7,0,0.3,1) forwards'
                : 'boot-bloom 440ms cubic-bezier(0.2,0.9,0.3,1) both',
            background:
              'radial-gradient(130% 100% at 50% 44%, #0d1724 0%, #05080e 54%, #000 100%)',
          }}
        >
          {/* Phosphor haze, so the type sits in the glass and not on it. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 46% at 50% 46%, rgba(115,198,254,0.16) 0%, transparent 72%)',
            }}
          />

          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="w-full max-w-[34rem]">
              {showPost && (
                <ul className="space-y-[0.55rem] font-mono text-[clamp(0.7rem,1.5vw,0.9rem)] leading-none text-glow">
                  {POST.map((line, i) => (
                    <li
                      key={line}
                      className="overflow-hidden whitespace-nowrap"
                      style={{
                        // Typed with steps(), so no per-character render ever
                        // happens — the browser reveals the glyphs itself.
                        width: 0,
                        animation: `type-in 260ms steps(${line.length}) ${i * 215}ms forwards`,
                        textShadow: '0 0 12px rgba(115,198,254,0.75)',
                      }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              )}

              {showBrand && (
                <div className="mt-9">
                  <div
                    className="chrome font-serif text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.92] tracking-[-0.03em]"
                    style={{ animationDuration: '2.6s' }}
                  >
                    Pietro
                  </div>
                  <div className="mt-3 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-soft">
                    <span>System ready</span>
                    <span
                      aria-hidden
                      className="inline-block h-[0.85em] w-[0.5em] bg-glow"
                      style={{ animation: 'caret 900ms steps(1) infinite' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scanlines and the bowed edge of the tube. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, rgba(0,0,0,0.42) 0 1px, transparent 1px 3px)',
              mixBlendMode: 'multiply',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                'inset 0 0 120px 40px rgba(0,0,0,0.85), inset 0 0 300px 90px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      )}

      {phase !== 'cut' && (
        <button
          type="button"
          onClick={finish}
          className="absolute bottom-7 right-7 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-soft transition-colors hover:text-ink"
        >
          Skip ▸
        </button>
      )}
    </div>
  );
}
