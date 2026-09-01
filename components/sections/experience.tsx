"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { Badge } from "@/components/ui/badge";
import { experience } from "@/data/experience";
import { VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked timeline. The rail fills as the section passes, and each node
 * takes the accent as its entry crosses — the progress is the section's motion,
 * so the entries themselves only need a quiet fade.
 */
export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 62%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });

  return (
    <Section id="experience">
      <Container>
        <SectionHeader
          index="06"
          eyebrow="Experience"
          title="Where the work happened."
          className="mb-14"
        />

        <div ref={ref} className="relative pl-8 sm:pl-12">
          <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-line sm:left-[11px]" />
          <motion.div
            aria-hidden
            style={{ scaleY: reduced ? 1 : scaleY }}
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-accent to-accent/30 sm:left-[11px]"
          />

          <ol className="flex flex-col gap-10 sm:gap-12">
            {experience.map((role, i) => (
              <TimelineRow key={role.id} role={role} index={i} progress={scrollYProgress} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

function TimelineRow({
  role,
  index,
  progress,
}: {
  role: (typeof experience)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduced = useReducedMotion();
  const threshold = index / experience.length;
  const nodeColor = useTransform(
    progress,
    [threshold, threshold + 0.12],
    ["var(--surface-3)", "var(--accent)"],
  );

  return (
    <motion.li
      className="relative"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <motion.span
        aria-hidden
        style={{ backgroundColor: reduced ? "var(--accent)" : nodeColor }}
        className={cn(
          "absolute top-1.5 -left-8 size-[15px] rounded-full ring-4 ring-bg sm:-left-12",
          "outline outline-line",
        )}
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="doto text-[10px] text-fg-faint">
            {role.start} — {role.end}
          </span>
          {role.current && <Badge variant="accent">Present</Badge>}
          {role.note && <Badge variant="outline">{role.note}</Badge>}
        </div>

        <h3 className="text-h3 leading-tight font-medium text-fg">{role.role}</h3>
        <p className="font-mono text-[0.85rem] text-fg-muted">{role.organisation}</p>
      </div>
    </motion.li>
  );
}
