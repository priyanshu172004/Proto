"use client";

import { motion } from "framer-motion";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { CardScrim } from "@/components/primitives/bento-card";
import { RevealGroup } from "@/components/primitives/reveal";
import { research } from "@/data/research";
import { revealVariants } from "@/lib/motion";
import { pad } from "@/lib/utils";

/**
 * Deliberately not "more projects": narrower cards, plot-like motifs, monospace
 * annotation, almost no colour. Reads as an instrument rack rather than a
 * product shelf.
 *
 * Titles only — descriptions are pending from the author, so the composition is
 * built to be complete without them rather than to hide a gap.
 */
export function Research() {
  return (
    <Section id="research">
      <Container>
        <SectionHeader
          index="03"
          eyebrow="Core Machine Learning"
          title="Research tracks."
          lede="Outcome-driven investigations sitting underneath the applied work."
          className="mb-14"
        />

        <RevealGroup
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          stagger={0.07}
        >
          {research.map((item, i) => (
            <motion.article
              key={item.id}
              variants={revealVariants}
              className="on-dark group card-surface relative flex min-h-[19rem] flex-col overflow-hidden rounded-md"
            >
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.03]"
              >
                <ResearchPlate index={i} />
              </div>

              <CardScrim height="52%" />

              <div className="relative z-20 mt-auto flex flex-col gap-2 p-5">
                <span className="doto text-[10px] text-accent">R-{pad(i + 1)}</span>
                <h3 className="doto text-[0.95rem] leading-tight font-semibold text-balance text-fg">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-caption text-fg-muted">{item.description}</p>
                )}
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/** Five hand-drawn plot motifs, one per track. Monochrome with a single accent. */
function ResearchPlate({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 bg-[#08080b]">
      <div
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.4) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, #000 0%, transparent 82%)",
        }}
      />
      <svg viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g stroke="rgb(255 255 255 / 0.22)" strokeWidth="0.7">
          <line x1="22" y1="24" x2="22" y2="196" />
          <line x1="22" y1="196" x2="178" y2="196" />
        </g>
        {[Topology, Regression, Spectrum, Contours, Federated][index % 5]()}
      </svg>
    </div>
  );
}

function Topology() {
  const nodes = [
    [52, 62],
    [110, 44],
    [156, 84],
    [72, 118],
    [134, 138],
    [46, 168],
    [166, 176],
  ] as const;
  return (
    <>
      <g stroke="rgb(255 255 255 / 0.2)" strokeWidth="0.7">
        {nodes.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={nodes[(i + 2) % nodes.length][0]} y2={nodes[(i + 2) % nodes.length][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 5 : 3} fill={i === 2 ? "var(--accent)" : "rgb(255 255 255 / 0.55)"} />
      ))}
      <path d="M156 84 l16 -14 m0 0 l-7 1 m7 -1 l-1 7" stroke="var(--accent)" strokeWidth="1.1" fill="none" />
    </>
  );
}

function Regression() {
  const pts = [
    [40, 176],
    [58, 160],
    [72, 152],
    [88, 128],
    [104, 124],
    [118, 100],
    [136, 88],
    [152, 66],
  ] as const;
  return (
    <>
      <line x1="34" y1="184" x2="164" y2="56" stroke="var(--accent)" strokeWidth="1.2" opacity="0.9" />
      <line x1="34" y1="196" x2="164" y2="68" stroke="rgb(255 255 255 / 0.16)" strokeWidth="0.7" strokeDasharray="3 4" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.2" fill="none" stroke="rgb(255 255 255 / 0.6)" strokeWidth="1" />
      ))}
    </>
  );
}

function Spectrum() {
  const bars = [28, 52, 38, 74, 96, 62, 118, 84, 46, 70, 34, 58];
  return (
    <>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={32 + i * 12}
          y={196 - h}
          width="6"
          height={h}
          rx="1"
          fill={i === 6 ? "var(--accent)" : "rgb(255 255 255 / 0.28)"}
        />
      ))}
      <path
        d="M32 120 q 18 -30 36 6 t 36 -18 t 36 24 t 36 -12"
        fill="none"
        stroke="rgb(255 255 255 / 0.35)"
        strokeWidth="0.9"
      />
    </>
  );
}

function Contours() {
  return (
    <>
      {[54, 40, 27, 15].map((r, i) => (
        <ellipse
          key={r}
          cx="100"
          cy="112"
          rx={r * 1.15}
          ry={r}
          fill="none"
          stroke={i === 3 ? "var(--accent)" : "rgb(255 255 255 / 0.26)"}
          strokeWidth={i === 3 ? 1.3 : 0.8}
        />
      ))}
      <g stroke="rgb(255 255 255 / 0.2)" strokeWidth="0.7">
        <line x1="100" y1="40" x2="100" y2="184" strokeDasharray="2 5" />
        <line x1="28" y1="112" x2="172" y2="112" strokeDasharray="2 5" />
      </g>
    </>
  );
}

function Federated() {
  const left = [
    [48, 70],
    [40, 104],
    [64, 134],
  ] as const;
  const right = [
    [150, 70],
    [160, 104],
    [136, 134],
  ] as const;
  return (
    <>
      <g stroke="rgb(255 255 255 / 0.2)" strokeWidth="0.7">
        {left.map(([x, y], i) => (
          <line key={`l${i}`} x1={x} y1={y} x2="100" y2="102" />
        ))}
        {right.map(([x, y], i) => (
          <line key={`r${i}`} x1={x} y1={y} x2="100" y2="102" strokeDasharray="3 4" />
        ))}
      </g>
      {[...left, ...right].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill="rgb(255 255 255 / 0.5)" />
      ))}
      <rect x="88" y="90" width="24" height="24" rx="3" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
      <rect x="93" y="95" width="14" height="14" rx="2" fill="var(--accent)" opacity="0.55" />
      <line x1="100" y1="130" x2="100" y2="176" stroke="rgb(255 255 255 / 0.18)" strokeWidth="0.7" strokeDasharray="2 4" />
      <rect x="86" y="176" width="28" height="12" rx="2" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="0.8" />
    </>
  );
}
