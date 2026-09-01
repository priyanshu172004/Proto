"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { RevealGroup } from "@/components/primitives/reveal";
import { byDomain, concepts, domains, type StackDomain } from "@/data/stack";
import { revealVariants, staggerParent, VIEWPORT } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

const BreadthChart = dynamic(() => import("./stack-chart").then((m) => m.BreadthChart), {
  ssr: false,
  loading: () => <div className="h-[236px]" />,
});

/**
 * The stack, laid out rather than hidden behind tabs.
 *
 * Every domain is open at once and sized by how much it actually holds, so the
 * grid itself reports the shape of the stack — Data & ML dominates because it
 * genuinely does. No hover states to discover, nothing gated behind a click.
 */

/**
 * Footprints chosen so the grid tiles exactly with no forced row spans —
 * an explicit span taller than its contents just manufactures dead space.
 * Row 1: Data & ML + Backend. Row 2: the three small domains + the chart.
 * Row 3: capabilities, full width.
 */
const LAYOUT: Record<StackDomain, string> = {
  data: "md:col-span-2",
  backend: "md:col-span-2",
  frontend: "md:col-span-1",
  infra: "md:col-span-1",
  languages: "md:col-span-1",
};

const ORDER: StackDomain[] = ["data", "backend", "frontend", "infra", "languages"];

export function Stack() {
  return (
    <Section id="stack">
      <Container>
        <SectionHeader
          index="04"
          eyebrow="Technology"
          title="The stack, in full."
          lede="Grouped by what it does rather than by logo, and sized by weight — the grid is the summary."
          className="mb-12"
        />

        <RevealGroup
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4"
          stagger={0.06}
        >
          {ORDER.map((id, i) => (
            <DomainCard key={id} domain={id} index={i} />
          ))}

          <motion.div
            variants={revealVariants}
            className="card-surface flex flex-col rounded-md p-5 sm:col-span-2 sm:p-6 md:col-span-1"
          >
            <p className="doto text-[10px] text-fg-faint">Breadth by domain</p>
            <p className="mt-1 mb-4 font-mono text-[11px] text-fg-faint">
              Count · not a proficiency score
            </p>
            <BreadthChart />
          </motion.div>

          <motion.div
            variants={revealVariants}
            className="card-surface flex flex-col rounded-md p-5 sm:col-span-2 sm:p-6 md:col-span-4"
          >
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <p className="doto text-[10px] text-fg-faint">Capabilities</p>
              <span className="doto text-[10px] text-fg-faint">{pad(concepts.length)}</span>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {concepts.map((concept) => (
                <li
                  key={concept}
                  className="doto rounded-xs border border-dashed border-line-strong px-2 py-1 text-[9px] text-fg-muted"
                >
                  {concept}
                </li>
              ))}
            </ul>
          </motion.div>
        </RevealGroup>
      </Container>
    </Section>
  );
}

function DomainCard({ domain, index }: { domain: StackDomain; index: number }) {
  const items = byDomain(domain);
  const label = domains.find((d) => d.id === domain)?.label ?? domain;
  const isLead = domain === "data";

  return (
    <motion.article
      variants={revealVariants}
      className={cn("card-surface flex flex-col rounded-md p-5 sm:p-6", LAYOUT[domain])}
    >
      <header className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-baseline gap-3">
          <span className="doto text-[10px] text-accent">{pad(index + 1)}</span>
          <h3 className={cn("doto text-fg", isLead ? "text-[13px]" : "text-[11px]")}>{label}</h3>
        </div>
        <span className="doto text-[10px] text-fg-faint">{pad(items.length)}</span>
      </header>

      <motion.ul
        className="flex flex-wrap gap-1.5"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerParent(0.018)}
      >
        {items.map((tech) => (
          <motion.li
            key={tech.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}
            className={cn(
              "rounded-full border border-line bg-surface-2 px-3 py-1.5 font-mono text-fg-muted",
              isLead ? "text-[12px]" : "text-[11px]",
            )}
          >
            {tech.label}
          </motion.li>
        ))}
      </motion.ul>
    </motion.article>
  );
}
