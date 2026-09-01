import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Consistent page gutter. Every section shares it so the rhythm holds. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[84rem] px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-(--spacing-section)", className)}>
      {children}
    </section>
  );
}

/**
 * The Doto index marker + title pairing that identifies every section.
 * The marker is what makes the page read as an instrument rather than a doc.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = "start",
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="doto text-[11px] text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        <span className="doto text-[11px] text-fg-faint">{eyebrow}</span>
      </div>
      <h2 className="text-h2 font-medium text-fg">{title}</h2>
      {lede && (
        <p className={cn("text-balance-measure text-fg-muted", align === "center" && "mx-auto")}>
          {lede}
        </p>
      )}
    </Reveal>
  );
}
