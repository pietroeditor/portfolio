import { useState } from 'react';
import { motion } from 'framer-motion';

import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { PaintFill } from '@/components/ui/PaintFill';

const WORLDS = [
  {
    key: 'roblox',
    name: 'Roblox',
    line: 'Comedy, proximity chat, trading and survival. Formats that live or die on reaction timing.',
    image: '/media/world-roblox.png',
    alt: 'A Roblox icon floating above a bright blocky world.',
  },
  {
    key: 'minecraft',
    name: 'Minecraft',
    line: 'Challenge, horror, rising-disaster and choice formats. Long runtimes held together by structure.',
    image: '/media/world-minecraft.png',
    alt: 'A Minecraft grass block floating above a sunlit landscape.',
  },
] as const;

function WorldCard({
  name,
  line,
  image,
  alt,
}: {
  name: string;
  line: string;
  image: string;
  alt: string;
}) {
  const [lit, setLit] = useState(false);

  return (
    <div
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      className="group glass-quiet relative overflow-hidden rounded-[1.5rem] p-3"
    >
      <PaintFill active={lit} />

      <div className="relative w-full overflow-hidden rounded-[0.875rem]">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="aspect-[16/10] w-full scale-[1.02] object-cover transition-transform duration-[900ms] ease-drift group-hover:scale-[1.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[0.875rem]"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(10,10,11,0.08)' }}
        />
      </div>

      <div className="relative px-1 pb-3.5 pt-3.5 text-cardTitle">{name}</div>

      <p
        className="relative rounded-[0.75rem] px-3.5 py-3 text-pretty text-[0.9375rem] font-medium leading-[1.5] tracking-[-0.012em] text-muted transition-colors duration-[620ms] ease-drift"
        style={{
          background: lit ? 'rgba(10,10,11,0.055)' : 'rgba(255,255,255,0.34)',
          boxShadow: 'inset 0 0 0 1px rgba(10,10,11,0.05)',
        }}
      >
        {line}
      </p>
    </div>
  );
}

export function Worlds() {
  return (
    <section id="worlds" className="relative py-bay">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.h2 variants={riseIn} className="max-w-[20ch] text-balance text-title">
            Two worlds, one job.
          </motion.h2>

          <div className="mt-block grid gap-5 md:grid-cols-2">
            {WORLDS.map(({ key, name, line, image, alt }) => (
              <motion.div key={key} variants={riseIn}>
                <WorldCard name={name} line={line} image={image} alt={alt} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
