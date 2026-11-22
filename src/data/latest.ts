import type { Reel } from '@/types';

/**
 * The newest pieces, shown full width at the top of the site.
 *
 * Every entry runs at full width, stacked under the one before it. These are
 * the pieces the section exists to show, so none of them gets put in a
 * half-size box to make the grid look balanced.
 *
 * Order here is order on the page — the first one is the first thing anyone
 * sees of the work, so it should be the strongest.
 *
 * Adding one: drop `<name>.mp4` and `<name>-poster.jpg` into `public/media`,
 * append an entry, and make sure `game` has a mark drawn for it in
 * `components/ui/GameMark`.
 */
export const latestWork: readonly Reel[] = [
  {
    id: 'brawl-stars-ranked-intro',
    title: 'Brawl Stars Ranked Guide Intro',
    game: 'brawl-stars',
    media: {
      poster: '/media/brawl-stars-intro-poster.jpg',
      video: '/media/brawl-stars-intro.mp4',
      alt: 'The Brawl Stars rank ladder sliding past a glowing Diamond badge on a blue sunburst.',
    },
  },
  {
    id: 'jump-to-steal-phonks',
    title: 'Roblox Jump to Steal Phonks',
    game: 'roblox',
    media: {
      poster: '/media/jump-to-steal-phonks-poster.jpg',
      video: '/media/jump-to-steal-phonks.mp4',
      alt: 'An animated Roblox character reacting in-game over live gameplay.',
    },
  },
];
