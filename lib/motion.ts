import type { Transition, Variants } from "framer-motion";

/**
 * The single source of motion truth. Every animated component imports from
 * here — that is what makes the site feel like one system rather than a
 * collection of independently-tuned effects.
 */

export const duration = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  cinematic: 0.9,
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const spring = {
  soft: { type: "spring", stiffness: 180, damping: 26, mass: 0.9 },
  snap: { type: "spring", stiffness: 400, damping: 34 },
  glide: { type: "spring", stiffness: 90, damping: 24, mass: 1.1 },
} satisfies Record<string, Transition>;

export const STAGGER = 0.06;

/** L3 — the default section/card reveal. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const staggerParent = (stagger: number = STAGGER, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** L4 — hero-grade entrance, used sparingly. */
export const heroVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.cinematic, ease: ease.out },
  },
};

/** Overlapping role rotator — outgoing rises out as incoming rises in. */
export const rotatorVariants: Variants = {
  enter: { opacity: 0, y: 44, filter: "blur(8px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -44,
    filter: "blur(8px)",
    transition: { duration: duration.base, ease: ease.inOut },
  },
};

export const VIEWPORT = { once: true, margin: "-12% 0px" } as const;
