import { motion } from 'framer-motion';

import { clients } from '@/data/clients';
import { formatCount } from '@/lib/format';
import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { Glow } from '@/components/ui/Glow';
import type { Client } from '@/types';

/**
 * Who the work is for.
 *
 * The strongest thing on the page that is not the work itself, so it gets the
 * lit plate the rest of the site keeps for what matters — and the card is the
 * link: a channel is somewhere to go, not something to read about.
 */
function ClientCard({ client }: { client: Client }) {
  return (
    <a
      href={client.href}
      target="_blank"
      // `noopener` is what stops the opened tab reaching back through
      // `window.opener`; `noreferrer` keeps the visitor's path to themselves.
      rel="noopener noreferrer"
      /*
        Built to the same anatomy as the capability cards: chip, title, and a
        panel set a step into the bottom. Centring this one put the content in
        a column down the middle and left two empty gutters either side — at
        three across that was most of the card doing nothing.
      */
      className="group glass-water relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-3 transition-transform duration-[480ms] ease-drift hover:-translate-y-1"
    >
      <Glow />

      <span className="relative z-[1] block h-11 w-11 shrink-0 overflow-hidden rounded-[0.75rem] transition-transform duration-[480ms] ease-drift group-hover:-translate-y-px group-hover:scale-[1.06]">
        <img
          src={client.avatar}
          alt=""
          loading="lazy"
          width={320}
          height={320}
          className="h-full w-full object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-[0.75rem]"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        />
      </span>

      <span className="relative z-[1] block px-1 pb-1 pt-5 text-cardTitle text-ink">
        {client.name}
      </span>
      <span className="relative z-[1] block px-1 pb-3.5 font-mono text-[0.75rem] tracking-[0.02em] text-faint">
        {client.handle}
      </span>

      {/* The number is the point of the section, so it gets the lit panel. */}
      <span
        className="relative z-[1] mt-auto flex items-baseline gap-2 rounded-[0.75rem] px-3.5 py-3 transition-colors duration-[480ms] ease-drift group-hover:bg-white/[0.07]"
        style={{
          background: 'rgba(255,255,255,0.035)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.055)',
        }}
      >
        <span className="tabular text-[1.375rem] font-semibold leading-none tracking-[-0.02em] text-glow">
          {formatCount(client.subscribers)}
        </span>
        <span className="text-[0.9375rem] font-medium leading-none tracking-[-0.01em] text-muted">
          subscribers
        </span>
      </span>
    </a>
  );
}

/**
 * The one red thing on the site.
 *
 * Every other accent here is the same blue, so a single red control reads as
 * a different kind of object — not another piece of the site's furniture but
 * a way out of it, to somewhere the claim can be checked. The colour is
 * YouTube's own, which is also the signal the visitor already knows.
 */
function VerifyButton() {
  return (
    <a
      href="https://ytjobs.co/@pietrosz"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex shrink-0 items-center gap-2.5 rounded-full py-3 pl-5 pr-4 text-[0.875rem] font-bold tracking-[-0.012em] text-white transition-transform duration-300 ease-drift hover:scale-[1.03] active:scale-95"
      style={{
        background: 'linear-gradient(170deg, #FF4B36 0%, #E8102A 46%, #B1000F 100%)',
        boxShadow:
          '0 0 32px -6px rgba(232,16,42,0.75), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(255,255,255,0.14)',
      }}
    >
      <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden fill="currentColor">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2Z" />
      </svg>
      <span>Verify on YTJobs</span>
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 ease-drift group-hover:translate-x-0.5"
      >
        <path d="M6 3.5 10.5 8 6 12.5" />
      </svg>
    </a>
  );
}

export function Clients() {
  return (
    <section id="clients" className="relative pb-bay">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div variants={riseIn}>
            <span className="eyebrow">Clients</span>

            {/*
              The heading states it; the button lets anyone check it. They sit
              on one line because the claim and its proof belong together —
              a verification link further down the page is a link nobody
              connects to the thing it verifies.
            */}
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-5">
              <h2 className="max-w-[20ch] text-balance font-serif text-title">
                Channels I've <span className="lit">worked with</span>.
              </h2>
              <VerifyButton />
            </div>
          </motion.div>

          <div className="mt-block grid auto-rows-fr gap-5 sm:grid-cols-2">
            {clients.map((client) => (
              <motion.div key={client.id} variants={riseIn} className="h-full">
                <div data-depth className="depth-item h-full">
                  <ClientCard client={client} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
