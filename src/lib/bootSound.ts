/**
 * The tube, heard.
 *
 * Synthesised rather than loaded: a file good enough to carry four seconds of
 * this would be a megabyte in a repository that is already carrying every
 * preview clip, and the schedule below is pinned to the same milliseconds as
 * the phases in `Boot`, so the thump lands on the strike and the collapse
 * lands on the cut without a second set of numbers to keep in step.
 *
 * Browsers refuse audio until the visitor has interacted with the page, so on
 * a cold first load this is silent. There is nothing to recover: the intro is
 * over in three and a half seconds, and a control offering to switch the
 * sound on would outlive the thing it switches on. It is left to fail quietly
 * and the picture carries the intro on its own.
 */

type Stop = () => void;

const SILENT: Stop = () => {};

/** Relative to the phases in `Boot`, in seconds. */
const OPEN = 0.46;
const POST = 0.9;
const POST_STEP = 0.215;
const POST_LINES = 6;
const BRAND = 2.56;
const CUT = 3.5;

/**
 * Peak of the whole thing against full scale. Low on purpose: this plays
 * without being asked for, so it has to sit under a conversation rather than
 * interrupt one.
 */
const LEVEL = 0.075;

export function playBootSound(level: number = LEVEL): Stop {
  const Ctor =
    typeof window === 'undefined'
      ? undefined
      : window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

  if (!Ctor) return SILENT;

  let ctx: AudioContext;
  try {
    ctx = new Ctor();
  } catch {
    return SILENT;
  }

  // Suspended means the page has not been interacted with yet. Worth asking,
  // never worth waiting for.
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {});

  const master = ctx.createGain();
  master.gain.value = level;
  master.connect(ctx.destination);

  const t0 = ctx.currentTime + 0.02;

  /** White noise, generated per use — these are all well under a second. */
  const noise = (seconds: number): AudioBufferSourceNode => {
    const frames = Math.max(1, Math.ceil(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    return source;
  };

  /** An envelope that only ever uses positive values — 0 is illegal here. */
  const env = (peak: number, at: number, attack: number, release: number) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + attack + release);
    return g;
  };

  /* The strike. A degauss coil letting go, and the crack of static with it. */
  const thump = ctx.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(124, t0);
  thump.frequency.exponentialRampToValueAtTime(38, t0 + 0.42);
  thump.connect(env(0.78, t0, 0.012, 0.47)).connect(master);
  thump.start(t0);
  thump.stop(t0 + 0.56);

  const crack = noise(0.14);
  const crackBand = ctx.createBiquadFilter();
  crackBand.type = 'bandpass';
  crackBand.frequency.value = 1900;
  crackBand.Q.value = 0.7;
  crack.connect(crackBand).connect(env(0.45, t0, 0.004, 0.1)).connect(master);
  crack.start(t0);

  /*
   * The raster opening: noise swept up through a band, like a seam widening.
   *
   * The envelope peak is far above 1 because a bandpass throws away most of
   * what white noise carries — measured against the strike, the same nominal
   * level came out twelve times quieter, which put this under the thump
   * instead of after it. The gain is downstream of the filter, so the number
   * is compensation for that loss, not headroom being spent.
   */
  const sweep = noise(0.6);
  const sweepBand = ctx.createBiquadFilter();
  sweepBand.type = 'bandpass';
  sweepBand.Q.value = 0.85;
  sweepBand.frequency.setValueAtTime(240, t0 + OPEN);
  sweepBand.frequency.exponentialRampToValueAtTime(3400, t0 + OPEN + 0.34);
  sweep.connect(sweepBand).connect(env(2.6, t0 + OPEN, 0.06, 0.44)).connect(master);
  sweep.start(t0 + OPEN);

  /*
   * Everything an old set leaves running underneath: mains hum, and the
   * flyback transformer at the line frequency a PAL tube actually ran at.
   * The whine is kept near the floor — it is the single most irritating
   * frequency a room can hold, and plenty of people cannot hear it at all.
   */
  const hum = ctx.createOscillator();
  hum.type = 'sine';
  hum.frequency.value = 60;
  const humGain = ctx.createGain();
  humGain.gain.setValueAtTime(0.0001, t0 + OPEN);
  humGain.gain.exponentialRampToValueAtTime(0.15, t0 + OPEN + 0.5);
  humGain.gain.setValueAtTime(0.15, t0 + CUT);
  humGain.gain.exponentialRampToValueAtTime(0.0001, t0 + CUT + 0.4);
  hum.connect(humGain).connect(master);
  hum.start(t0 + OPEN);
  hum.stop(t0 + CUT + 0.45);

  const flyback = ctx.createOscillator();
  flyback.type = 'sine';
  flyback.frequency.value = 15625;
  const flybackGain = ctx.createGain();
  flybackGain.gain.setValueAtTime(0.0001, t0 + OPEN);
  flybackGain.gain.exponentialRampToValueAtTime(0.022, t0 + OPEN + 0.6);
  flybackGain.gain.setValueAtTime(0.022, t0 + CUT);
  flybackGain.gain.exponentialRampToValueAtTime(0.0001, t0 + CUT + 0.2);
  flyback.connect(flybackGain).connect(master);
  flyback.start(t0 + OPEN);
  flyback.stop(t0 + CUT + 0.25);

  /* One tick per line of the check, on the same stride the type runs at. */
  for (let i = 0; i < POST_LINES; i += 1) {
    const at = t0 + POST + i * POST_STEP;
    const tick = noise(0.04);
    const edge = ctx.createBiquadFilter();
    edge.type = 'highpass';
    edge.frequency.value = 2600;
    tick.connect(edge).connect(env(0.2, at, 0.003, 0.026)).connect(master);
    tick.start(at);
  }

  /* The wordmark arriving — two notes a fifth apart, swelling and gone. */
  [196, 294].forEach((hz, i) => {
    const tone = ctx.createOscillator();
    tone.type = 'triangle';
    // Drifting up into pitch is what makes it read as a machine settling
    // rather than a note being played.
    tone.frequency.setValueAtTime(hz * 0.988, t0 + BRAND);
    tone.frequency.linearRampToValueAtTime(hz, t0 + BRAND + 0.55);
    tone.connect(env(i === 0 ? 0.26 : 0.17, t0 + BRAND, 0.34, 0.95)).connect(master);
    tone.start(t0 + BRAND);
    tone.stop(t0 + BRAND + 1.4);
  });

  /* The cut: the picture collapsing to a dot, and the set going quiet. */
  const collapse = ctx.createOscillator();
  collapse.type = 'sine';
  collapse.frequency.setValueAtTime(260, t0 + CUT);
  collapse.frequency.exponentialRampToValueAtTime(58, t0 + CUT + 0.2);
  collapse.connect(env(0.5, t0 + CUT, 0.008, 0.3)).connect(master);
  collapse.start(t0 + CUT);
  collapse.stop(t0 + CUT + 0.36);

  const dot = noise(0.2);
  const dotBand = ctx.createBiquadFilter();
  dotBand.type = 'bandpass';
  dotBand.Q.value = 2.4;
  dotBand.frequency.setValueAtTime(5200, t0 + CUT);
  dotBand.frequency.exponentialRampToValueAtTime(900, t0 + CUT + 0.16);
  dot.connect(dotBand).connect(env(0.3, t0 + CUT, 0.005, 0.17)).connect(master);
  dot.start(t0 + CUT);

  let stopped = false;

  return () => {
    // The intro can be skipped at any point, so this has to be able to land
    // mid-schedule — a hard close would clip, which is louder than the sound.
    if (stopped) return;
    stopped = true;

    try {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    } catch {
      /* already torn down by the browser — closing below is still correct */
    }

    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 200);
  };
}
