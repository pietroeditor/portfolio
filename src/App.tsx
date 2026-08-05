import { useCallback, useState } from 'react';

import { featuredProjects } from '@/data/projects';
import { site } from '@/data/site';

import { useAccent } from '@/hooks/useAccent';
import { Shell, Backdrop } from '@/components/layout/Shell';
import { Header } from '@/components/layout/Header';
import { LiquidReveal } from '@/components/ui/LiquidReveal';
import { WorkGrid } from '@/components/work/WorkGrid';
import { Worlds } from '@/components/sections/Worlds';
import { Contact } from '@/components/sections/Contact';
import { VideoModal } from '@/components/media/VideoModal';
import type { Project } from '@/types';

export default function App() {
  const [accentSource, setAccentSource] = useState<Project>(featuredProjects[0]);
  const [playing, setPlaying] = useState<Project | null>(null);

  useAccent((playing ?? accentSource).accent);

  const handleOpen = useCallback((project: Project) => {
    if (!project.youtubeId) return;
    setPlaying(project);
  }, []);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-8 focus:top-8 focus:z-[180] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-micro focus:font-semibold focus:text-shell"
      >
        Skip to work
      </a>

      <Backdrop />

      <main
        id="top"
        className="relative z-10"
        style={{ paddingLeft: 'var(--frame)', paddingRight: 'var(--frame)' }}
      >
        <Header site={site} />

        <WorkGrid projects={featuredProjects} onOpen={handleOpen} onHover={setAccentSource} />

        <LiquidReveal>
          <Worlds />
        </LiquidReveal>

        <LiquidReveal>
          <Contact site={site} />
        </LiquidReveal>
      </main>

      <Shell />

      <VideoModal project={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
