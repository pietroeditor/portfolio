/**
 * Accent colours are sampled from each poster, then normalised to one
 * saturation and lightness so the six washes read as a single system —
 * only hue carries the project's identity.
 */

/** `#3EB0CC` → `62 176 204`, ready for `rgb(… / <alpha>)`. */
export function channels(hex: string): string {
  const value = hex.replace('#', '');
  const int = parseInt(
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value,
    16,
  );

  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

/** A soft, wide pool of light — the frame spilling onto the page behind it. */
export function ambientWash(hex: string, alpha: number): string {
  const rgb = channels(hex);
  return [
    `radial-gradient(58% 46% at 50% 44%, rgb(${rgb} / ${alpha}) 0%,`,
    `rgb(${rgb} / ${alpha * 0.5}) 38%,`,
    `rgb(${rgb} / 0) 72%)`,
  ].join(' ');
}
