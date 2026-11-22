import type { GameMark as Game } from '@/types';

/**
 * The mark of the game a clip is from.
 *
 * Drawn here rather than loaded as brand art: these sit at 26px inside a lit
 * plate, where a downloaded logo would arrive full-colour and fight both the
 * glow around it and the frame behind it. A single-colour silhouette reads at
 * that size, takes the plate's own light, and costs no request.
 */

const MARKS: Record<Game, { label: string; path: JSX.Element }> = {
  /*
   * Roblox: a square leaned to the right with a square hole through it, the
   * hole on the same lean. Both are drawn as one path so `evenodd` punches
   * the second out of the first.
   */
  roblox: {
    label: 'Roblox',
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 1.3 30.7 7.5 24.5 30.7 1.3 24.5Z M12.96 10.74 21.26 12.96 19.04 21.26 10.74 19.04Z"
      />
    ),
  },

  /*
   * Brawl Stars: the star, with the points pulled in hard so it reads as a
   * burst rather than the thin five-point star every rating widget uses.
   */
  'brawl-stars': {
    label: 'Brawl Stars',
    path: (
      <path d="M16 1.6 20.1 11.3 30.6 12.2 22.6 19.1 25 29.4 16 23.9 7 29.4 9.4 19.1 1.4 12.2 11.9 11.3Z" />
    ),
  },
};

export function GameMark({ game, size = 26 }: { game: Game; size?: number }) {
  const mark = MARKS[game];

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={mark.label}
      fill="currentColor"
      style={{
        // The plate is already lit; this just keeps the silhouette from
        // looking pasted on top of it.
        filter: 'drop-shadow(0 0 10px rgba(115,198,254,0.75))',
      }}
    >
      {mark.path}
    </svg>
  );
}
