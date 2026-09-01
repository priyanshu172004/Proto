"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BookOpen, MapPin, Volleyball } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { BentoCard, CardScrim } from "@/components/primitives/bento-card";
import { RevealGroup } from "@/components/primitives/reveal";
import { profile } from "@/data/profile";
import { portrait } from "@/data/gallery";
import { useClock } from "@/lib/client-hooks";
import { VIEWPORT, staggerParent } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <Section id="about">
      <Container>
        <SectionHeader
          index="01"
          eyebrow="About"
          title="Systems, not demos."
          lede="Where the research ends and the engineering begins."
          className="mb-14"
        />

        <RevealGroup
          className="grid auto-rows-[13rem] grid-cols-2 gap-3 md:grid-cols-4"
          stagger={0.07}
        >
          <PortraitCard />
          <SummaryCard />
          <EducationCard />
          <InterestsCard />
          <ReadsCard />
          <LocationCard />
        </RevealGroup>
      </Container>
    </Section>
  );
}

function PortraitCard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <BentoCard
      span="1x1"
      className="col-span-2 row-span-2 md:col-span-1 md:col-start-1 md:row-start-1"
    >
      <div ref={ref} className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[6%] h-[112%]">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            sizes="(max-width: 768px) 100vw, 22vw"
            placeholder="blur"
            blurDataURL={portrait.blurDataURL}
            priority
            className={cn(
              "object-cover object-center transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
              "grayscale-[0.85] contrast-[1.05] group-hover:grayscale-0 group-hover:contrast-100",
            )}
          />
        </motion.div>
      </div>
      <CardScrim height="46%" />
      <div className="relative z-20 mt-auto p-5">
        <p className="doto text-[10px] text-accent">{profile.initials}</p>
        <p className="doto mt-1 text-[11px] text-fg">{profile.name}</p>
      </div>
    </BentoCard>
  );
}

function SummaryCard() {
  return (
    <BentoCard
      span="2x1"
      className="col-span-2 md:col-span-3 md:col-start-2 md:row-start-1"
    >
      <div className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8">
        <p className="text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-fg">
          {profile.summary}
        </p>
      </div>
      <Corner />
    </BentoCard>
  );
}

function EducationCard() {
  return (
    <BentoCard
      span="2x2"
      className="col-span-2 row-span-2 md:col-start-2 md:row-start-2"
    >
      <div className="flex h-full flex-col p-6 sm:p-8">
        <p className="doto mb-7 text-[10px] text-fg-faint">Education</p>
        <ol className="relative flex flex-1 flex-col justify-between gap-6">
          <motion.span
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-[5px] w-px origin-top bg-gradient-to-b from-accent via-accent/40 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
          {profile.education.map((item, i) => (
            <motion.li
              key={item.institution}
              className="relative pl-7"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-1.5 left-0 size-[11px] rounded-full border",
                  i === profile.education.length - 1
                    ? "border-accent bg-accent"
                    : "border-line-strong bg-surface-2",
                )}
              />
              <p className="doto text-[10px] text-fg-faint">{item.stage}</p>
              <p className="mt-1.5 leading-snug font-medium text-fg">{item.institution}</p>
              <p className="mt-0.5 font-mono text-caption text-fg-muted">{item.location}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </BentoCard>
  );
}

const INTEREST_ICONS = { football: Volleyball, reading: BookOpen } as const;

function InterestsCard() {
  return (
    <BentoCard span="1x1" className="md:col-start-4 md:row-start-2">
      <div className="flex h-full flex-col p-6">
        <p className="doto text-[10px] text-fg-faint">Interests</p>
        <div className="mt-auto flex flex-col gap-4">
          {profile.interests.map((interest) => {
            const Icon = INTEREST_ICONS[interest.icon];
            return (
              <div key={interest.label} className="flex items-center gap-3">
                <Icon className="size-4 text-accent" strokeWidth={1.4} />
                <span className="text-[0.95rem] text-fg">{interest.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </BentoCard>
  );
}

function ReadsCard() {
  return (
    <BentoCard span="1x1" className="md:col-start-1 md:row-start-3" interactive>
      <div className="flex h-full flex-col p-6">
        <p className="doto text-[10px] text-fg-faint">Recent Reads</p>
        <motion.ul
          className="mt-auto flex flex-col gap-1.5"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={staggerParent(0.05)}
        >
          {profile.recentReads.map((book, i) => (
            <motion.li
              key={book.title}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
              }}
              className="group/spine relative flex items-center gap-2.5"
            >
              <span
                aria-hidden
                className="h-4 w-[3px] shrink-0 rounded-full transition-all duration-300 group-hover:h-5"
                style={{ background: `color-mix(in oklab, var(--accent) ${92 - i * 14}%, transparent)` }}
              />
              <span className="truncate font-mono text-[0.72rem] text-fg-muted transition-colors group-hover:text-fg">
                {book.title}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </BentoCard>
  );
}

function LocationCard() {
  return (
    <BentoCard span="1x1" className="md:col-start-4 md:row-start-3">
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 text-accent" strokeWidth={1.5} />
          <p className="doto text-[10px] text-fg-faint">Located</p>
        </div>
        <div className="mt-auto">
          <p className="doto text-[12px] text-fg">{profile.location}</p>
          <Clock />
        </div>
      </div>
    </BentoCard>
  );
}

const CLOCK_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

/** Live IST clock. Serves a placeholder server-side so hydration is stable. */
function Clock() {
  const time = useClock(profile.timezone, CLOCK_FORMAT, 1000);

  return (
    <p className="doto mt-2 text-[22px] text-accent tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"}
    </p>
  );
}

/** A quiet technical tick mark — repeated on wide informational cards. */
function Corner() {
  return (
    <span
      aria-hidden
      className="absolute top-5 right-5 size-2.5 border-t border-r border-line-strong"
    />
  );
}
