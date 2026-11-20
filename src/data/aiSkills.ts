import type { AiSkill } from '@/types';

/**
 * AI effect highlights.
 *
 * Short, silent-safe clips that show one effect each. The first entry is the
 * hero of the section and runs full width; everything after it falls into a
 * two-up grid, so the section stays composed at any count.
 *
 * Adding one: drop `<name>.mp4` and `<name>-poster.jpg` into `public/media`
 * and append an entry here. Nothing else needs to change.
 */
export const aiSkills: readonly AiSkill[] = [
  {
    id: 'jump-to-steal-phonks',
    title: 'Roblox Jump to Steal Phonks',
    tag: 'AI character animation',
    note: 'Avatars rebuilt as AI-animated performers, lip-synced to the live call and composited back over the raw gameplay.',
    media: {
      poster: '/media/ai-jump-to-steal-phonks-poster.jpg',
      video: '/media/ai-jump-to-steal-phonks.mp4',
      alt: 'An AI-animated Roblox character reacting in-game over live gameplay.',
    },
  },
];
