"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/layout/smooth-scroll";
import { useSafeReducedMotion } from "@/lib/client-hooks";
import { useActiveSection } from "@/lib/use-active-section";
import { duration, ease, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ThemeMorphToggle } from "./theme-morph-toggle";

export type MenuItem = { id: string; label: string };

/**
 * The primary navigation.
 *
 * One container morphs between a collapsed pill and the expanded item rail —
 * a single `layout` transition on the same element, not a cross-fade between
 * two sizes. The morph is the component; everything else supports it.
 */
export function LiquidMorphFloatingMenu({ items }: { items: readonly MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(items.map((i) => i.id));
  const lenis = useLenis();
  const reduced = useSafeReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const go = (id: string) => {
    close();
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const transition = reduced ? { duration: 0.15 } : spring.soft;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[80] flex",
        "inset-x-3 top-3 justify-end",
        "md:inset-x-auto md:top-auto md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:justify-center",
      )}
    >
      <motion.div
        ref={containerRef}
        layout
        transition={transition}
        role="navigation"
        aria-label="Primary"
        initial={false}
        // The radius has to travel with the size, or the expanded panel keeps
        // the collapsed pill's 999px and reads as a giant ellipse on mobile.
        animate={{ borderRadius: open ? 24 : 999 }}
        className={cn(
          "pointer-events-auto flex max-w-full items-center gap-1 overflow-hidden",
          "border border-line bg-surface/95 p-1.5 backdrop-blur-xl md:bg-surface/80",
          "shadow-[var(--card-highlight),0_8px_40px_-12px_rgb(0_0_0/0.55)]",
          open ? "w-full flex-col md:w-auto md:flex-row" : "flex-row",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.ul
              key="items"
              layout
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="grid w-full grid-cols-2 gap-0.5 sm:grid-cols-3 md:flex md:w-auto md:flex-row md:items-center md:gap-0"
              onMouseLeave={() => setHovered(null)}
            >
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      onMouseEnter={() => setHovered(item.id)}
                      onFocus={() => setHovered(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "doto relative block w-full rounded-full px-3 py-2.5 text-center text-[11px] transition-colors md:px-3.5 md:py-2 md:text-left",
                        isActive ? "text-accent-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={transition}
                          className="absolute inset-0 -z-10 rounded-full bg-accent"
                        />
                      )}
                      <CharLabel label={item.label} active={hovered === item.id} reduced={!!reduced} />
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          ) : (
            <motion.span
              key="wordmark"
              layout
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="doto px-3 text-[11px] whitespace-nowrap text-fg-muted"
            >
              PS
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="toggle"
              layout
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="flex w-full items-center justify-center overflow-hidden md:w-auto"
            >
              <span aria-hidden className="mx-1 hidden h-5 w-px bg-line md:block" />
              <ThemeMorphToggle />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={toggleRef}
          layout
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-9 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <MorphIcon open={open} reduced={!!reduced} />
        </motion.button>
      </motion.div>
    </div>
  );
}

/** Per-character lift on hover — the small physical detail that sells the menu. */
function CharLabel({
  label,
  active,
  reduced,
}: {
  label: string;
  active: boolean;
  reduced: boolean;
}) {
  if (reduced) return <span>{label}</span>;
  return (
    <span className="inline-flex whitespace-nowrap">
      {label.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          animate={{ y: active ? -1.5 : 0, opacity: active ? 1 : 0.92 }}
          transition={{ duration: duration.fast, ease: ease.out, delay: active ? i * 0.02 : 0 }}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}

/** Hamburger ⇄ close as two animated paths, not an icon swap. */
function MorphIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
  const t = reduced ? { duration: 0.15 } : spring.snap;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      animate={{ rotate: open ? 90 : 0 }}
      transition={t}
      aria-hidden
    >
      <motion.path
        d="M4 9 L20 9"
        initial={false}
        animate={{ d: open ? "M7 7 L17 17" : "M4 9 L20 9" }}
        transition={t}
      />
      <motion.path
        d="M4 15 L20 15"
        initial={false}
        animate={{ d: open ? "M17 7 L7 17" : "M4 15 L20 15" }}
        transition={t}
      />
    </motion.svg>
  );
}

export default LiquidMorphFloatingMenu;
