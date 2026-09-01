"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { spring } from "@/lib/motion";

type CursorState = "default" | "interactive" | "text" | "media";

const SIZE = 28;

/**
 * A transparent ring that follows the pointer on a spring, plus a small
 * trailing dot. Difference blending keeps it legible over the shader, over
 * photography, and in both themes without any per-section tuning.
 *
 * Never mounted on touch devices or under reduced motion — and the native
 * cursor is restored in those cases via the `data-cursor` body attribute.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, spring.soft);
  const ringY = useSpring(y, spring.soft);
  const dotX = useSpring(x, spring.snap);
  const dotY = useSpring(y, spring.snap);

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute("data-cursor");
      return;
    }
    document.body.setAttribute("data-cursor", "custom");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement | null;
      const hit = el?.closest<HTMLElement>("[data-cursor-target]");
      const explicit = hit?.dataset.cursorTarget as CursorState | undefined;
      if (explicit) {
        setState(explicit);
        return;
      }
      if (el?.closest("a, button, [role='button'], input, select, textarea")) {
        setState("interactive");
        return;
      }
      setState("default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.body.removeAttribute("data-cursor");
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const ring = {
    default: { scale: 1, borderWidth: 1, opacity: 0.6, radius: "50%", w: SIZE, h: SIZE },
    interactive: { scale: 2.2, borderWidth: 0.5, opacity: 0.42, radius: "50%", w: SIZE, h: SIZE },
    text: { scale: 1, borderWidth: 0, opacity: 0.85, radius: "1px", w: 2, h: 26 },
    media: { scale: 3.4, borderWidth: 0.4, opacity: 0.5, radius: "50%", w: SIZE, h: SIZE },
  }[state];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[200]"
      style={{ mixBlendMode: "difference" }}
    >
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center border-white"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderStyle: "solid",
        }}
        animate={{
          width: ring.w,
          height: ring.h,
          scale: ring.scale,
          opacity: visible ? ring.opacity : 0,
          borderWidth: ring.borderWidth,
          borderRadius: ring.radius,
          backgroundColor:
            state === "text" ? "rgb(255 255 255)" : "rgb(255 255 255 / 0.04)",
        }}
        transition={spring.snap}
      >
        <motion.span
          className="doto text-white select-none"
          style={{ fontSize: 4.4 }}
          animate={{ opacity: state === "media" ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          View
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 rounded-full bg-white"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: state === "default" ? 3 : 0,
          height: state === "default" ? 3 : 0,
          opacity: visible && state === "default" ? 0.9 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
