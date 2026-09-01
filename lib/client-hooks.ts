"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

/**
 * Browser state read through `useSyncExternalStore` rather than
 * `useState` + `useEffect`.
 *
 * The effect-and-setState version renders once with a wrong value, then
 * re-renders — a cascading render on every mount, and the thing React's
 * `set-state-in-effect` rule exists to prevent. These subscribe to the real
 * source instead and serve a deterministic server snapshot.
 */

const neverChanges = () => () => {};

/** False during SSR and the first client render, true once hydrated. */
export function useHydrated() {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * Reduced-motion that is safe to branch MARKUP on.
 *
 * The raw hook reads matchMedia on the first client render, but the server
 * cannot — so any component that renders different elements for reduced motion
 * hydrates against mismatched HTML (React #418). Reporting `false` until
 * hydration makes the first client render agree with the server, and the real
 * value lands immediately after.
 *
 * Where only transition VALUES differ, the raw framer hook is fine.
 */
export function useSafeReducedMotion() {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  return hydrated ? Boolean(reduced) : false;
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * A formatted wall clock in a fixed time zone. The snapshot is cached and only
 * replaced when the formatted string actually changes, which is what keeps
 * `getSnapshot` stable across a render pass.
 *
 * `options` must be a stable reference — declare it at module scope, not inline.
 */
export function useClock(
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
  intervalMs = 1000,
) {
  const cache = useRef<string | null>(null);

  const formatter = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { ...options, timeZone }),
    [timeZone, options],
  );

  const subscribe = useCallback(
    (onChange: () => void) => {
      const tick = () => {
        const next = formatter.format(new Date());
        if (next !== cache.current) {
          cache.current = next;
          onChange();
        }
      };
      tick();
      const id = window.setInterval(tick, intervalMs);
      return () => window.clearInterval(id);
    },
    [formatter, intervalMs],
  );

  return useSyncExternalStore(
    subscribe,
    () => cache.current,
    () => null,
  );
}
