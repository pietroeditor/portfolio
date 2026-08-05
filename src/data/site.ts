import type { SiteConfig } from '@/types';

export const site: SiteConfig = {
  name: 'Pietro',
  role: 'Video Editor — Variety & Entertainment',
  location: 'Remote · Working across CET and EST',
  statement: 'I make people finish the video.',
  intro:
    'I cut long-form for variety and entertainment channels — Roblox comedy, challenge formats, reaction and podcast work. The job is not making footage look nice. The job is making the next minute feel unskippable.',
  availability: 'Taking on two channels for Q4',
  email: 'hello@pietroeditor.com',
  discord: 'pietrosz',

  stats: [
    { value: '48M+', label: 'Views delivered' },
    { value: '120+', label: 'Videos cut' },
    { value: '48h', label: 'Typical first cut' },
    { value: '3.5 yrs', label: 'Editing full time' },
  ],

  process: [
    {
      step: '01',
      title: 'You send the raws',
      body: 'Drive, Dropbox, Frame.io — whatever you already use. A one-line brief is enough: the format, the runtime you want, and the moment you think is the best in the footage.',
      duration: 'Day 0',
    },
    {
      step: '02',
      title: 'I send a first cut',
      body: 'Structured, paced, sound designed, graphics roughed in. Not an assembly — something you could publish if you had to. Timestamped notes make the next round faster.',
      duration: '48 hours',
    },
    {
      step: '03',
      title: 'Two rounds of notes',
      body: 'Included, always. I work from your timestamps and reply to each one so nothing gets lost. Structural changes are welcome in round one.',
      duration: '24 hours each',
    },
    {
      step: '04',
      title: 'Delivery',
      body: 'Master file, thumbnail frames pulled at full resolution, and the project archived so a re-edit six months from now takes an hour instead of a day.',
      duration: 'Same day',
    },
  ],

  updatedAt: 'August 2026',
};
