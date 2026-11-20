import { motion } from 'framer-motion';

import { riseIn, stagger, viewportOnce } from '@/lib/motion';
import { Glow } from '@/components/ui/Glow';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { SiteConfig } from '@/types';

function MethodCard({
  label,
  value,
  href,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  href: string | null;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="group glass-quiet relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-3 transition-transform duration-500 ease-drift hover:-translate-y-1">
      <Glow />

      <div className="relative flex items-center justify-between gap-4 px-1 pt-1">
        <span className="text-[0.9375rem] font-semibold tracking-[-0.012em] text-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="relative z-[1] rounded-full border border-line px-3 py-1.5 text-micro font-semibold text-muted transition-colors duration-200 hover:border-glow/50 hover:text-ink"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {href ? (
        <a
          href={href}
          className="relative mt-4 block break-all px-1 pb-3.5 text-[clamp(1.05rem,2.1vw,1.5rem)] font-bold tracking-[-0.024em] transition-opacity duration-300 hover:opacity-60"
        >
          {value}
        </a>
      ) : (
        <span className="relative mt-4 block break-all px-1 pb-3.5 text-[clamp(1.05rem,2.1vw,1.5rem)] font-bold tracking-[-0.024em]">
          {value}
        </span>
      )}
    </div>
  );
}

export function Contact({ site }: { site: SiteConfig }) {
  const { copied, copy } = useCopyToClipboard();

  const methods = [
    { label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { label: 'Discord', value: site.discord, href: null },
  ];

  return (
    <section id="contact" className="relative pb-bay">
      <div className="mx-auto w-full max-w-shell px-gutter">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div variants={riseIn}>
            {/* Same rank as every other section heading — the page ends level. */}
            <span className="eyebrow">Get in touch</span>
            <h2 className="mt-5 max-w-[16ch] text-balance font-serif text-title">Contact</h2>
            <p className="mt-5 max-w-prose text-pretty text-lead text-muted">
              Reach out if you'd like to work together.
            </p>
          </motion.div>

          <motion.div variants={riseIn} className="mt-block grid gap-5 md:grid-cols-2">
            {methods.map((m) => (
              <div key={m.label} data-depth className="depth-item h-full">
                <MethodCard
                  label={m.label}
                  value={m.value}
                  href={m.href}
                  copied={copied}
                  onCopy={() => void copy(m.value)}
                />
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={riseIn}
            className="mt-10 flex items-center justify-between gap-4 border-t border-lineSoft pt-6"
          >
            <span className="text-micro text-faint">{site.name}</span>
            <span className="text-micro text-faint tabular">{new Date().getFullYear()}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
