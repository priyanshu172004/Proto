"use client";

import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type LenisApi = {
  /** Pause smooth scrolling — used while a modal owns the viewport. */
  stop: () => void;
  start: () => void;
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number }) => void;
};

const LenisContext = createContext<LenisApi | null>(null);

/**
 * A single Lenis instance driving one rAF loop for the whole document.
 * Touch smoothing stays off: native momentum feels better than an emulated one.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const api = useMemo<LenisApi>(
    () => ({
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      scrollTo: (target, opts) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset: opts?.offset ?? 0, duration: 1.1 });
          return;
        }
        // Reduced-motion / pre-init fallback.
        if (typeof target === "number") {
          window.scrollTo({ top: target });
          return;
        }
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        el?.scrollIntoView({ block: "start" });
      },
    }),
    [],
  );

  return <LenisContext.Provider value={api}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Stops Lenis while `open` is true so modal scroll containers behave natively,
 * and restores it on close.
 */
export function useLenisLock(open: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => lenis.start();
  }, [open, lenis]);
}
