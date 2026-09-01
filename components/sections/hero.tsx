"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/primitives/section";
import { useSafeReducedMotion } from "@/lib/client-hooks";
import { duration, ease, heroVariants, rotatorVariants, staggerParent } from "@/lib/motion";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const ShaderBackground = dynamic(
  () => import("@/components/ui/shader-background").then((m) => m.ShaderBackground),
  { ssr: false },
);

const TYPE_SPEED = 55;
const ROLE_DWELL = 2400;

export function Hero() {
  const reduced = useSafeReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const typed = useTyping(profile.name, reduced ? 0 : TYPE_SPEED);
  const nameComplete = typed.length === profile.name.length;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {/* Held at low opacity on purpose — a whisper of drift behind the name,
            not a background people notice before they read it. */}
        <div className="absolute inset-0 opacity-[0.34] dark:opacity-[0.38]">
          <ShaderBackground className="h-full w-full" />
        </div>
        {/* Keeps the type legible over the brightest part of the field. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/15 to-bg" />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(115% 75% at 10% 48%, var(--bg) 0%, transparent 58%)",
          }}
        />
      </div>

      <motion.div className="relative z-10" style={{ y: contentY, opacity: contentOpacity }}>
        <Container className="pt-28 pb-24">
          <motion.div initial="hidden" animate="visible" variants={staggerParent(0.1)}>
            <motion.p
              variants={heroVariants}
              className="doto mb-8 text-[11px] text-fg-muted"
            >
              {profile.disciplines.join(" · ")}
            </motion.p>

            <h1 className="doto text-display leading-[0.86] font-semibold text-fg">
              <span className="sr-only">{profile.name}</span>
              <span aria-hidden className="inline-block break-words">
                {typed}
                <span
                  className={cn(
                    "ml-[0.08em] inline-block h-[0.62em] w-[0.09em] translate-y-[0.02em] bg-accent align-baseline",
                    nameComplete && "motion-safe:animate-[caret-blink_1s_steps(1)_infinite]",
                  )}
                  style={{ opacity: nameComplete && reduced ? 0 : 1 }}
                />
              </span>
            </h1>

            <div className="mt-6 flex h-[1.6em] items-center overflow-hidden sm:mt-8">
              <RoleRotator roles={profile.roles} start={nameComplete} reduced={!!reduced} />
            </div>

            <motion.p
              variants={heroVariants}
              className="mt-8 max-w-[60ch] text-fg-muted sm:mt-10"
            >
              {reduced ? profile.tagline : <WordReveal text={profile.tagline} start={nameComplete} />}
            </motion.p>
          </motion.div>
        </Container>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: duration.slow }}
        style={{ opacity: contentOpacity }}
        className="absolute right-8 bottom-10 z-10 hidden flex-col items-center gap-3 md:flex"
      >
        <span className="doto text-[10px] text-fg-faint">Scroll</span>
        <span aria-hidden className="relative h-12 w-px overflow-hidden bg-line-strong">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-accent"
            animate={reduced ? {} : { y: [-16, 48] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Character-by-character reveal. A speed of 0 (reduced motion) is derived at
 * render rather than written back through state, so switching to reduced motion
 * mid-animation shows the whole name instead of freezing it half-typed.
 */
function useTyping(text: string, speed: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (speed === 0) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return speed === 0 ? text : text.slice(0, count);
}

/**
 * Roles overlap rather than replace: the outgoing word rises out of frame as
 * the incoming one rises in, both blurring through the handover.
 */
function RoleRotator({
  roles,
  start,
  reduced,
}: {
  roles: readonly string[];
  start: boolean;
  reduced: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!start || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), ROLE_DWELL);
    return () => window.clearInterval(id);
  }, [start, reduced, roles.length]);

  if (reduced) {
    return <p className="doto text-[13px] text-accent sm:text-[15px]">{roles.join(" · ")}</p>;
  }

  return (
    <p className="relative w-full" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index]}
          variants={rotatorVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="doto block text-[13px] text-accent sm:text-[15px]"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}

/**
 * Word-level reveal with explicit per-word delays. Variant-driven staggering
 * this deep inherits the hero's own 0.9s transition and leaves the tail of the
 * sentence stranded at opacity 0; explicit delays are immune to that.
 */
function WordReveal({ text, start }: { text: string; start: boolean }) {
  return (
    <span className="inline">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: duration.base, ease: ease.out, delay: start ? i * 0.018 : 0 }}
          className="inline-block whitespace-pre"
        >
          {word + " "}
        </motion.span>
      ))}
    </span>
  );
}
