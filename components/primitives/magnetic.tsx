"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useSafeReducedMotion } from "@/lib/client-hooks";
import { spring } from "@/lib/motion";

/**
 * Pulls toward the pointer, capped so it never detaches from its hit area.
 * Deliberately used exactly once on the page — on the primary contact CTA.
 */
export function Magnetic({
  children,
  strength = 0.35,
  max = 12,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useSafeReducedMotion();
  const x = useSpring(useMotionValue(0), spring.snap);
  const y = useSpring(useMotionValue(0), spring.snap);

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-max, Math.min(max, dx)));
    y.set(Math.max(-max, Math.min(max, dy)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}
