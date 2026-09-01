"use client";

import { ArrowUp, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Container } from "@/components/primitives/section";
import { GithubIcon, LeetCodeIcon, LinkedinIcon } from "@/components/primitives/brand-icons";
import { ThemeMorphToggle } from "@/components/ui/theme-morph-toggle";
import { useLenis } from "@/components/layout/smooth-scroll";
import { useClock } from "@/lib/client-hooks";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

const LINKS = [
  { label: "GitHub", href: socials.github, Icon: GithubIcon },
  { label: "LinkedIn", href: socials.linkedin, Icon: LinkedinIcon },
  { label: "LeetCode", href: socials.leetcode, Icon: LeetCodeIcon },
  { label: "Email", href: `mailto:${socials.email}`, Icon: Mail },
] as const;

export function Footer() {
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <Container>
        <div className="flex flex-col gap-10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="doto text-[10px] text-fg-faint">
              {profile.disciplines.join(" · ")}
            </p>
            <p className="mt-4 max-w-[34ch] text-fg-muted">
              Building systems where the intelligence is the architecture.
            </p>
          </div>

          <ul className="flex flex-wrap gap-2">
            {LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-line bg-surface-2/60 text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line py-6">
          <p className="doto text-[10px] text-fg-faint">
            © {new Date().getFullYear()} {profile.name}
          </p>

          <div className="flex items-center gap-2">
            <LocalTime />
            <span aria-hidden className="mx-1 h-5 w-px bg-line" />
            <ThemeMorphToggle />
            <button
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="group grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </Container>

      <TorchWordmark />
    </footer>
  );
}

const CLOCK_FORMAT: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

/**
 * Oversized wordmark as a graphic base, deliberately cropped by the viewport.
 *
 * A torch follows the pointer across it: a soft emerald pool that lifts the
 * letterforms only where the light falls. The bright copy is masked to a
 * radial gradient at the cursor, so the glow reveals the type rather than
 * washing a colour over it.
 */
function TorchWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [torch, setTorch] = useState<{ x: number; y: number } | null>(null);

  const track = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setTorch({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const mask = torch
    ? `radial-gradient(circle 190px at ${torch.x}px ${torch.y}px, #000 0%, rgb(0 0 0 / 0.55) 42%, transparent 72%)`
    : "radial-gradient(circle 0px at 50% 50%, transparent 0%, transparent 100%)";

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={track}
      onPointerLeave={() => setTorch(null)}
      className="relative -mb-[0.22em] overflow-hidden px-2"
    >
      <p className="doto w-full text-center leading-none font-bold whitespace-nowrap text-fg/[0.055] [font-size:clamp(3rem,13.2vw,13rem)]">
        {profile.name}
      </p>

      {/* Lit copy, revealed only under the torch. */}
      <p
        className="doto pointer-events-none absolute inset-0 w-full px-2 text-center leading-none font-bold whitespace-nowrap text-accent/70 [font-size:clamp(3rem,13.2vw,13rem)]"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          transition: "opacity 400ms ease",
          opacity: torch ? 1 : 0,
        }}
      >
        {profile.name}
      </p>

      {/* The light itself — a mild green bloom sitting over the letterforms. */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: torch
            ? `radial-gradient(circle 210px at ${torch.x}px ${torch.y}px, var(--accent-glow) 0%, transparent 70%)`
            : "none",
          filter: "blur(26px)",
          transition: "opacity 400ms ease",
          opacity: torch ? 1 : 0,
        }}
      />
    </div>
  );
}

function LocalTime() {
  const time = useClock(profile.timezone, CLOCK_FORMAT, 30_000);

  return (
    <span className="doto text-[10px] text-fg-faint tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"} IST
    </span>
  );
}
