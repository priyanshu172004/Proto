"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { revealVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type BentoSpan = "1x1" | "2x1" | "1x2" | "2x2" | "3x1" | "full";

const spanClass: Record<BentoSpan, string> = {
  "1x1": "col-span-2 md:col-span-1 row-span-1",
  "2x1": "col-span-2 row-span-1",
  "1x2": "col-span-2 md:col-span-1 row-span-2",
  "2x2": "col-span-2 row-span-2",
  "3x1": "col-span-2 md:col-span-3 row-span-1",
  full: "col-span-2 md:col-span-4 row-span-1",
};

/**
 * The one card in the system. Spans, hover physics, border warmth and the
 * scrim treatment all live here — sections compose it rather than restyling it,
 * which is what keeps twelve different grids feeling like one page.
 */
export function BentoCard({
  span = "1x1",
  className,
  children,
  interactive = false,
  ...props
}: HTMLMotionProps<"div"> & {
  span?: BentoSpan;
  interactive?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={revealVariants}
      whileHover={interactive && !reduced ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        "group card-surface relative isolate flex min-h-[13rem] flex-col overflow-hidden rounded-md",
        "transition-colors duration-300",
        interactive && "hover:border-accent/30",
        spanClass[span],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Progressive bottom blur — four stacked backdrop layers with staggered masks.
 * A single blurred div produces a visible hard edge; layering the masks makes
 * the blur ramp up smoothly, which is what the reference cards actually do.
 */
export function CardScrim({
  height = "62%",
  className,
}: {
  height?: string;
  className?: string;
}) {
  const layers = [
    { blur: 1, from: 0, to: 34 },
    { blur: 3, from: 22, to: 56 },
    { blur: 8, from: 44, to: 78 },
    { blur: 18, from: 66, to: 100 },
  ];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-10", className)}
      style={{ height }}
    >
      {layers.map((layer) => (
        <div
          key={layer.blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
            maskImage: `linear-gradient(to top, #000 ${100 - layer.to}%, transparent ${100 - layer.from}%)`,
            WebkitMaskImage: `linear-gradient(to top, #000 ${100 - layer.to}%, transparent ${100 - layer.from}%)`,
          }}
        />
      ))}
      <div className="scrim-bottom absolute inset-0" />
    </div>
  );
}

/** The visual plate behind a card's content. Scales gently on card hover. */
export function CardVisual({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 z-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
        "motion-safe:group-hover:scale-[1.04]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Content that sits inside the blurred band at the foot of a card. */
export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative z-20 mt-auto flex flex-col gap-2.5 p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}
