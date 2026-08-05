export type ProjectTier = 'featured' | 'more';

export interface ProjectMedia {
  /** Still frame shown at rest. Also used as the video poster. */
  readonly poster: string;
  /** Optional preview clip. When present, the cursor scrubs it. */
  readonly video?: string;
  /** Optional frame strip used when no clip is available. Scrubbed by index. */
  readonly frames?: readonly string[];
  readonly alt: string;
}

export interface ProjectMetric {
  readonly label: string;
  readonly value: string;
}

export interface Project {
  readonly id: string;
  readonly tier: ProjectTier;
  readonly title: string;
  /** Short format descriptor, e.g. "Roblox · Long-form". */
  readonly format: string;
  readonly year: number;
  /** Display runtime, e.g. "14:22". */
  readonly runtime: string;
  /** Runtime in seconds — drives the scrub timecode. */
  readonly durationSeconds: number;
  readonly summary: string;
  readonly roles: readonly string[];
  readonly tools: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly media: ProjectMedia;
  /**
   * Dominant hue sampled from the poster, normalised to one saturation and
   * lightness. Drives the ambient light the card casts onto the page.
   */
  readonly accent?: string;
  /** YouTube video id. When present, the card opens the video in a modal. */
  readonly youtubeId?: string;
  readonly href?: string;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export interface ProcessStep {
  readonly step: string;
  readonly title: string;
  readonly body: string;
  readonly duration: string;
}

export interface SiteConfig {
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly statement: string;
  readonly intro: string;
  readonly availability: string;
  readonly email: string;
  readonly discord: string;
  readonly stats: readonly Stat[];
  readonly process: readonly ProcessStep[];
  readonly updatedAt: string;
}
