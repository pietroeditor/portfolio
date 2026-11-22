const FPS = 24;

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

/** Format seconds as an editorial timecode: MM:SS:FF at 24 fps. */
export function formatTimecode(seconds: number, fps: number = FPS): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const minutes = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const frames = Math.floor((safe % 1) * fps);
  return `${pad(minutes)}:${pad(secs)}:${pad(frames)}`;
}

/** Clamp a number into a range. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Zero-padded ordinal used for project indices: 01, 02, 03… */
export function indexLabel(index: number): string {
  return pad(index + 1);
}

/**
 * A big number, the way a viewer already reads one: 742K, 1.2M, 40.9K.
 *
 * Rounded down, never up — a card that claims 1M on 998,400 is wrong in the
 * direction that matters. One decimal is kept below ten units so 1.2M does
 * not flatten to 1M, and dropped above it where the digit is noise.
 */
export function formatCount(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0';

  const units = [
    { at: 1e9, suffix: 'B' },
    { at: 1e6, suffix: 'M' },
    { at: 1e3, suffix: 'K' },
  ];

  for (const { at, suffix } of units) {
    if (value < at) continue;
    const scaled = value / at;
    // Truncate rather than round, then trim a trailing .0 — 2.0M reads worse
    // than 2M and says nothing more.
    const digits = scaled < 10 ? Math.floor(scaled * 10) / 10 : Math.floor(scaled);
    return `${digits}${suffix}`;
  }

  return String(Math.floor(value));
}
