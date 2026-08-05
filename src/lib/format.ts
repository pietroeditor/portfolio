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
