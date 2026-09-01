"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, CalendarClock } from "lucide-react";
import { Container, Section } from "@/components/primitives/section";
import { Reveal } from "@/components/primitives/reveal";
import { Magnetic } from "@/components/primitives/magnetic";
import { GithubIcon, LeetCodeIcon, LinkedinIcon } from "@/components/primitives/brand-icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLenisLock } from "@/components/layout/smooth-scroll";
import { calLink, socials } from "@/data/socials";
import { cn } from "@/lib/utils";

/** Only pulled into the bundle when a Cal.com handle is actually configured. */
const CalEmbed = dynamic(() => import("./cal-embed").then((m) => m.CalEmbed), {
  ssr: false,
  loading: () => (
    <div className="grid h-[520px] place-items-center">
      <span className="doto text-[10px] text-fg-faint">Loading scheduler…</span>
    </div>
  ),
});

const CHANNELS = [
  { id: "linkedin", label: "LinkedIn", href: socials.linkedin, Icon: LinkedinIcon },
  { id: "github", label: "GitHub", href: socials.github, Icon: GithubIcon },
  { id: "leetcode", label: "LeetCode", href: socials.leetcode, Icon: LeetCodeIcon },
] as const;

export function Contact() {
  const [booking, setBooking] = useState(false);
  useLenisLock(booking);

  return (
    <Section id="contact" className="pb-32 md:pb-40">
      <Container>
        <Reveal className="card-surface relative overflow-hidden rounded-lg px-6 py-16 sm:px-12 sm:py-24">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-40 h-96 opacity-70"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 100%, var(--accent-glow) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <p className="doto mb-8 text-[10px] text-accent">Contact</p>

            <h2 className="doto max-w-[18ch] text-[clamp(1.9rem,6.2vw,4.4rem)] leading-[0.95] font-semibold text-fg">
              Let&apos;s build something intelligent.
            </h2>

            <p className="mt-7 max-w-[54ch] text-fg-muted">
              Have an idea, research problem, product concept, or system that could benefit from
              intelligent engineering? The fastest way in is a short call.
            </p>

            <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
              <Magnetic>
                <BookingCta onOpen={() => setBooking(true)} />
              </Magnetic>
              <CopyEmail />
            </div>

            <ul className="mt-14 flex flex-wrap items-center justify-center gap-3">
              {CHANNELS.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doto group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface-2/70 px-4 py-2.5 text-[10px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <Icon className="size-3.5" />
                    {label}
                    <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>

      <Dialog open={booking} onOpenChange={setBooking}>
        <DialogContent className="max-w-3xl p-0 sm:p-0">
          <DialogTitle className="doto border-b border-line px-6 py-4 text-[11px] text-fg">
            Book a call
          </DialogTitle>
          <div className="p-2 sm:p-4">{booking && <CalEmbed link={calLink} />}</div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

/**
 * With NEXT_PUBLIC_CAL_LINK set this opens the embedded scheduler. Without it,
 * the button falls back to a prefilled email — no phone number was supplied, so
 * there is deliberately no `tel:` anywhere on this site.
 */
function BookingCta({ onOpen }: { onOpen: () => void }) {
  const mailto = `mailto:${socials.email}?subject=${encodeURIComponent(
    "Call request — Priyanshu Srivastava",
  )}&body=${encodeURIComponent(
    "Hi Priyanshu,\n\nI'd like to set up a short call about:\n\n\nA few times that work for me:\n\n",
  )}`;

  const className = cn(
    "doto inline-flex h-14 items-center gap-3 rounded-full bg-accent px-8 text-[12px] text-accent-fg",
    "shadow-[0_0_0_1px_var(--accent-deep),0_16px_44px_-16px_var(--accent-glow)]",
    "transition-colors hover:bg-accent-hi",
  );

  if (calLink) {
    return (
      <button type="button" onClick={onOpen} className={className}>
        <CalendarClock className="size-4" />
        Book a call
      </button>
    );
  }

  return (
    <a href={mailto} className={className}>
      <CalendarClock className="size-4" />
      Request a call
    </a>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${socials.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex h-14 items-center gap-3 rounded-full border border-line bg-surface-2/70 px-6 font-mono text-[12px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      <span className="hidden sm:inline">{socials.email}</span>
      <span className="sm:hidden">Copy email</span>
      {copied ? (
        <span className="doto inline-flex items-center gap-1.5 text-[10px] text-accent">
          <Check className="size-3.5" />
          Copied
        </span>
      ) : (
        <Copy className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </button>
  );
}
