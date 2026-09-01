"use client";

import { motion } from "framer-motion";
import { GitPullRequest, Trophy } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { Badge } from "@/components/ui/badge";
import { hackathons, openSource } from "@/data/achievements";
import { VIEWPORT } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

export function Signals() {
  return (
    <Section id="signals">
      <Container>
        <SectionHeader
          index="05"
          eyebrow="Signals"
          title="Built in public, tested under clock."
          lede="Open-source programmes and competition results — where the work met other people's deadlines."
          className="mb-14"
        />

        <RevealGroup className="grid gap-3 lg:grid-cols-[22rem_1fr]" stagger={0.08}>
          <RevealItem className="card-surface flex flex-col rounded-md p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <GitPullRequest className="size-3.5 text-accent" strokeWidth={1.6} />
              <p className="doto text-[10px] text-fg-faint">Open Source</p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {openSource.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center justify-between gap-4 rounded-sm border border-line bg-surface-2/60 px-4 py-3.5 transition-colors hover:border-line-strong"
                >
                  <span className="text-[0.9rem] leading-snug text-fg">{item.program}</span>
                  <span className="doto shrink-0 text-[10px] text-fg-faint transition-colors group-hover:text-accent">
                    {item.year}
                  </span>
                </li>
              ))}
            </ul>

            <p className="doto mt-auto pt-6 text-[10px] text-fg-faint">
              {pad(openSource.length)} programmes
            </p>
          </RevealItem>

          <RevealItem className="card-surface flex flex-col rounded-md p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <Trophy className="size-3.5 text-accent" strokeWidth={1.6} />
              <p className="doto text-[10px] text-fg-faint">Hackathons</p>
            </div>

            <ol className="flex flex-col">
              {hackathons.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className={cn(
                    "group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors last:border-b-0",
                    "hover:bg-surface-2/40",
                  )}
                >
                  <span className="doto text-[10px] text-fg-faint">{pad(i + 1)}</span>

                  <div className="min-w-0">
                    <p className="leading-snug font-medium text-fg">
                      {item.event}
                      <span className="doto ml-2 text-[10px] text-fg-faint">{item.year}</span>
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-fg-muted">
                      {[item.organisation, item.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>

                  <Badge variant={item.highlight ? "accent" : "outline"} className="shrink-0">
                    {item.result}
                  </Badge>
                </motion.li>
              ))}
            </ol>
          </RevealItem>
        </RevealGroup>
      </Container>
    </Section>
  );
}
