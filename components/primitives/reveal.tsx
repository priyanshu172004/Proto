"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { revealVariants, staggerParent, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** L3 — the standard scroll reveal. One component so timing never drifts. */
export function Reveal({
  className,
  children,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealVariants}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a group so children reveal in sequence rather than all at once. */
export function RevealGroup({
  className,
  children,
  stagger,
  delayChildren,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number; delayChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerParent(stagger, delayChildren)}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A child of RevealGroup. Inherits the parent's stagger timing. */
export function RevealItem({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={revealVariants} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
