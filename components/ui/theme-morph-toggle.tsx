"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/client-hooks";
import { cn } from "@/lib/utils";
import { duration, ease, spring } from "@/lib/motion";

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * Sun ⇄ moon as a single morphing mark: the disc shrinks, a masking disc
 * slides in to carve the crescent, and the rays retract. Swapping two icons
 * would read as a state change; morphing reads as the same object turning.
 */
export function ThemeMorphToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const isDark = hydrated ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px] overflow-visible" aria-hidden>
        <defs>
          <mask id="theme-morph-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <motion.circle
              cx="18"
              cy="5"
              r="8"
              fill="black"
              initial={false}
              animate={{ cx: isDark ? 18 : 30, cy: isDark ? 5 : 0 }}
              transition={spring.soft}
            />
          </mask>
        </defs>

        <motion.circle
          cx="12"
          cy="12"
          r="8.5"
          fill="currentColor"
          mask="url(#theme-morph-mask)"
          initial={false}
          animate={{ r: isDark ? 8.5 : 5.2 }}
          transition={spring.soft}
        />

        <motion.g
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -45 : 0, scale: isDark ? 0.6 : 1 }}
          transition={{ duration: duration.base, ease: ease.out }}
          style={{ transformOrigin: "12px 12px" }}
        >
          {RAYS.map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="2.6"
              x2="12"
              y2="4.6"
              transform={`rotate(${angle} 12 12)`}
            />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
