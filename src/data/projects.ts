import type { Project } from '@/types';

/**
 * Single source of truth for every project on the site.
 *
 * Media convention (drop files in /public/media, keep the names):
 *   /media/<slug>-poster.jpg   still frame shown at rest
 *   /media/<slug>-preview.mp4  short muted clip, scrubbed by the cursor
 *
 * A project with a `youtubeId` opens that video in a modal when its card is
 * clicked. The visitor never leaves the site.
 *
 * Anything referenced here that does not exist yet degrades gracefully:
 * the card falls back to a typographic plate instead of a broken image.
 */
export const projects: readonly Project[] = [
  {
    id: 'my-wood-farm-in-roblox',
    tier: 'featured',
    title: 'My Wood Farm in Roblox',
    format: 'Roblox · Long-form comedy',
    year: 2025,
    runtime: '14:22',
    durationSeconds: 862,
    summary:
      'A grinding simulator turned into an escalating bit. The edit treats every log as a plot point — small wins stacked into a rhythm, then broken on purpose so the payoff lands where the graph usually dips.',
    roles: ['Edit', 'Sound design', 'Motion graphics'],
    tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
    metrics: [
      { label: 'Avg. view duration', value: '8:41' },
      { label: 'Retention at 10 min', value: '62%' },
      { label: 'Cuts', value: '1,140' },
    ],
    media: {
      poster: '/media/wood-farm-poster.jpg',
      video: '/media/wood-farm-preview.mp4',
      alt: 'A Roblox lumber yard mid-build, framed as the video opens.',
    },
    accent: '#3EB0CC',
    youtubeId: 'YRDVD2VXnJI',
  },
  {
    id: 'ragebaiting-with-voicechat',
    tier: 'featured',
    title: 'Ragebaiting with Voicechat',
    format: 'Minecraft · Prank',
    year: 2025,
    runtime: '09:47',
    durationSeconds: 587,
    summary:
      'Built entirely around reaction timing. Cuts land on the breath before the shout, not after it, so each response hits cold. Audio is ducked and stacked to keep six overlapping voices legible.',
    roles: ['Edit', 'Dialogue mix', 'Captioning'],
    tools: ['Premiere Pro', 'After Effects', 'iZotope RX'],
    metrics: [
      { label: 'Avg. view duration', value: '6:12' },
      { label: 'Clip reposts', value: '40+' },
      { label: 'Cuts', value: '890' },
    ],
    media: {
      poster: '/media/ragebait-poster.jpg',
      video: '/media/ragebait-preview.mp4',
      alt: 'Split-screen of live voice chat reactions during a Roblox lobby.',
    },
    accent: '#CCAD3E',
    youtubeId: '3teeK2xQADo',
  },
  {
    id: 'dont-choose-the-wrong-house',
    tier: 'featured',
    title: "Don't Choose the Wrong House",
    format: 'Challenge · Narrative',
    year: 2024,
    runtime: '16:38',
    durationSeconds: 998,
    summary:
      'A choice format that only works if the stakes are legible in under three seconds. Custom countdown graphics, a recurring audio motif for every wrong door, and a cold open pulled from minute eleven.',
    roles: ['Edit', 'Story structure', 'Graphics package'],
    tools: ['Premiere Pro', 'After Effects', 'Cinema 4D'],
    metrics: [
      { label: 'Avg. view duration', value: '9:58' },
      { label: 'Click-through', value: '11.4%' },
      { label: 'Cuts', value: '1,470' },
    ],
    media: {
      poster: '/media/wrong-house-poster.jpg',
      video: '/media/wrong-house-preview.mp4',
      alt: 'Three identical houses lined up before the first choice.',
    },
    accent: '#3E7FCC',
    youtubeId: '06LPlNfbd1I',
  },
  {
    id: 'choose-one-two-or-three',
    tier: 'featured',
    title: 'Choose One, Two or Three',
    format: 'Minecraft · Choice format',
    year: 2026,
    runtime: '24:38',
    durationSeconds: 1478,
    summary:
      'Twenty-five minutes of a format that resets every ninety seconds. Each round has to re-establish stakes from nothing, so the cut leans on a fixed rhythm — options read, beat of doubt, commit — and then breaks that rhythm the moment it starts feeling safe.',
    roles: ['Edit', 'Story structure', 'Graphics package'],
    tools: ['Premiere Pro', 'After Effects'],
    metrics: [],
    media: {
      poster: '/media/choose-poster.jpg',
      video: '/media/choose-preview.mp4',
      alt: 'A wall of Minecraft item choices laid out in labelled columns.',
    },
    accent: '#3E81CC',
    youtubeId: 'W_aSC-BGOBo',
  },
  {
    id: 'real-verity-mod',
    tier: 'featured',
    title: 'We Played The REAL Verity Mod',
    format: 'Minecraft · Horror',
    year: 2026,
    runtime: '16:58',
    durationSeconds: 1018,
    summary:
      'Horror in a blocky world only works if you protect the quiet. Long holds with nothing in frame, no music bed to telegraph the scare, and the reaction cut placed a beat late so the audience sees the thing before the players do.',
    roles: ['Edit', 'Sound design', 'Colour'],
    tools: ['Premiere Pro', 'After Effects', 'iZotope RX'],
    metrics: [],
    media: {
      poster: '/media/verity-poster.jpg',
      video: '/media/verity-preview.mp4',
      alt: 'A grinning yellow figure filling a cabin doorway at night.',
    },
    accent: '#CC8B3E',
    youtubeId: 'IBnu8gUYpfQ',
  },
  {
    id: 'coca-cola-rises',
    tier: 'featured',
    title: '1 Second = Coca Cola Rises',
    format: 'Minecraft · Rising disaster',
    year: 2026,
    runtime: '15:25',
    durationSeconds: 925,
    summary:
      'A timer format where the threat is always visible, so the edit never has to explain it. Pace is tied to the water line — cuts lengthen while it is low, then tighten as it climbs, until the last third runs on almost nothing but reaction.',
    roles: ['Edit', 'Motion graphics', 'Sound design'],
    tools: ['Premiere Pro', 'After Effects', 'Cinema 4D'],
    metrics: [],
    media: {
      poster: '/media/coca-poster.jpg',
      video: '/media/coca-preview.mp4',
      alt: 'Two players climbing a helicopter ladder above a rising cola flood.',
    },
    accent: '#CC7A3E',
    youtubeId: 'mjmfimpKQCQ',
  },

  {
    id: 'survived-100-days-as-a-noob',
    tier: 'more',
    title: 'I Survived 100 Days as a Noob',
    format: 'Roblox · Survival challenge',
    year: 2025,
    runtime: '22:10',
    durationSeconds: 1330,
    summary:
      'A hundred days compressed into a rising curve — day counters as chapter cards, and four deliberate slow moments so the pace has somewhere to fall from.',
    roles: ['Edit', 'Graphics package'],
    tools: ['Premiere Pro', 'After Effects'],
    metrics: [{ label: 'Avg. view duration', value: '11:26' }],
    media: {
      poster: '/media/survived-100-days-as-a-noob/poster.jpg',
      alt: 'Day counter overlay on a Roblox survival island.',
    },
  },
  {
    id: 'worst-trade-in-history',
    tier: 'more',
    title: 'The Worst Trade in Adopt Me History',
    format: 'Roblox · Trading',
    year: 2024,
    runtime: '11:03',
    durationSeconds: 663,
    summary:
      'Value comparisons that had to be readable on a phone. Every trade is a two-column graphic held exactly long enough to be understood, then cut.',
    roles: ['Edit', 'Motion graphics'],
    tools: ['Premiere Pro', 'After Effects'],
    metrics: [{ label: 'Avg. view duration', value: '6:44' }],
    media: {
      poster: '/media/worst-trade-in-history/poster.jpg',
      alt: 'Trade comparison graphic between two Roblox inventories.',
    },
  },
  {
    id: 'secret-base-under-the-map',
    tier: 'more',
    title: 'We Built a Secret Base Under the Map',
    format: 'Roblox · Building',
    year: 2024,
    runtime: '18:45',
    durationSeconds: 1125,
    summary:
      'Build montages usually kill retention. This one is cut as a heist: progress withheld, reveal held back to the final third.',
    roles: ['Edit', 'Sound design'],
    tools: ['Premiere Pro', 'After Effects'],
    metrics: [{ label: 'Retention at 15 min', value: '48%' }],
    media: {
      poster: '/media/secret-base-under-the-map/poster.jpg',
      alt: 'An underground base carved beneath a Roblox map.',
    },
  },
  {
    id: 'reading-chat-confessions',
    tier: 'more',
    title: "Reading My Chat's Worst Confessions",
    format: 'Podcast · Vertical clips',
    year: 2025,
    runtime: '08:29',
    durationSeconds: 509,
    summary:
      'Twelve verticals cut from one two-hour stream. Each clip opens on the reaction, not the setup — the confession arrives second.',
    roles: ['Edit', 'Captioning', 'Clip selection'],
    tools: ['Premiere Pro', 'Descript'],
    metrics: [{ label: 'Clips delivered', value: '12' }],
    media: {
      poster: '/media/reading-chat-confessions/poster.jpg',
      alt: 'Vertical clip frame with burned-in captions.',
    },
  },
  {
    id: 'the-3am-server',
    tier: 'more',
    title: 'The 3AM Server Nobody Joins',
    format: 'Horror comedy · Long-form',
    year: 2024,
    runtime: '13:57',
    durationSeconds: 837,
    summary:
      'Tone control as the whole job. Silence is used as an edit — three full seconds of nothing before every jump, which is why the laugh afterwards works.',
    roles: ['Edit', 'Sound design', 'Colour'],
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    metrics: [{ label: 'Avg. view duration', value: '8:03' }],
    media: {
      poster: '/media/the-3am-server/poster.jpg',
      alt: 'An empty Roblox lobby lit by a single streetlight.',
    },
  },
  {
    id: 'every-item-ranked-by-pain',
    tier: 'more',
    title: 'Every Item, Ranked by Pain',
    format: 'Ranking · List format',
    year: 2023,
    runtime: '15:12',
    durationSeconds: 912,
    summary:
      'Forty items in fifteen minutes without the list feeling like a list. Rank cards animate in from the previous item, so the format never resets.',
    roles: ['Edit', 'Graphics package'],
    tools: ['Premiere Pro', 'After Effects'],
    metrics: [{ label: 'Items covered', value: '40' }],
    media: {
      poster: '/media/every-item-ranked-by-pain/poster.jpg',
      alt: 'Ranking card animating over gameplay footage.',
    },
  },
];

export const featuredProjects: readonly Project[] = projects.filter(
  (project) => project.tier === 'featured',
);

export const moreProjects: readonly Project[] = projects.filter(
  (project) => project.tier === 'more',
);

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
