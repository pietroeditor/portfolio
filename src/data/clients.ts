import type { Client } from '@/types';

/**
 * The channels the work goes to.
 *
 * Names and subscriber counts were read off the channels themselves on
 * 2026-11-22 — `subscribers` is stored raw so the figure stays checkable and
 * refreshing it is a one-number edit. It will drift; that is fine, because
 * it is rounded down on the way to the screen and so can only ever understate.
 *
 * The avatars are served from `public/media/clients` rather than hotlinked
 * from YouTube: a linked image would break the day the channel changes it,
 * and would hand every visitor's address to a third party for nothing.
 */
export const clients: readonly Client[] = [
  {
    id: 'sunny-and-melon',
    name: 'Sunny and Melon',
    handle: '@sunnyandmelon',
    subscribers: 3070000,
    avatar: '/media/clients/sunny-and-melon.jpg',
    href: 'https://www.youtube.com/@sunnyandmelon',
  },
  {
    id: 'melon-and-sunny',
    name: 'Melon and Sunny',
    handle: '@melonandsunny',
    subscribers: 2250000,
    avatar: '/media/clients/melon-and-sunny.jpg',
    href: 'https://www.youtube.com/@melonandsunny',
  },
];
