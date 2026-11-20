import { useCallback, useState } from 'react';

import { featuredProjects } from '@/data/projects';
import { site } from '@/data/site';

import { useAccent } from '@/hooks/useAccent';
import { useView } from '@/hooks/useView';
import { Shell, Backdrop } from '@/components/layout/Shell';
import { Dock } from '@/components/layout/Dock';
import { Boot } from '@/components/boot/Boot';
import { DepthField } from '@/components/fx/DepthField';
import { WhatIDo } from '@/components/sections/WhatIDo';
import { WorkGrid } from '@/components/work/WorkGrid';
import { AiSkills } from '@/components/sections/AiSkills';
import { Contact } from '@/components/sections/Contact';
import { VideoModal } from '@/components/media/VideoModal';
import type { Project } from '@/types';

export default function App() {
  const [accentSource, setAccentSource] = useState<Project>(featuredProjects[0]);
  const [playing, setPlaying] = useState<Project | null>(null);
  const [booted, setBooted] = useState(false);
  const [view, go] = useView();

  useAccent((playing ?? accentSource).accent);

  const handleOpen = useCallback((project: Project) => {
    if (!project.youtubeId) return;
    setPlaying(project);
  }, []);

  const handleBooted = useCallback(() => setBooted(true), []);

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-8 focus:top-8 focus:z-[180] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-micro focus:font-semibold focus:text-shell"
      >
        Skip to work
      </a>

      <Backdrop />

      {/*
        One depth field over the whole page: each pane marked `data-depth`
        inside it bows away from the reading line as you scroll, so the site
        reads as one curved surface instead of a stack of flat lists.
      */}
      <DepthField>
        {/*
          No bar at the top any more: the dock at the foot of the screen is
          the whole navigation, so the page opens straight on the work.
        */}
        <main
          id="top"
          className="relative z-10 pt-gutter"
          style={{ paddingLeft: 'var(--frame)', paddingRight: 'var(--frame)' }}
        >
          {/*
            One page, four sections, in the order the nav lists them — the
            nav and the dock mark where you are and scroll you there.
          */}
          <WorkGrid projects={featuredProjects} onOpen={handleOpen} onHover={setAccentSource} />

          <AiSkills />

          <WhatIDo />

          <Contact site={site} />

          {/* Room for the dock to float clear of the last row. */}
          <div aria-hidden className="h-24" />
        </main>
      </DepthField>

      <Shell />

      {/* Held back until the tube has handed the screen over. */}
      {booted && <Dock view={view} onGo={go} />}

      <VideoModal project={playing} onClose={() => setPlaying(null)} />

      <Boot onDone={handleBooted} />
    </>
  );
}
