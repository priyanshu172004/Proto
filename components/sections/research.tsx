"use client";

import { motion } from "framer-motion";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { RevealGroup } from "@/components/primitives/reveal";
import { Badge } from "@/components/ui/badge";
import { research, type ResearchMotif, type ResearchProject } from "@/data/research";
import { revealVariants } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

/**
 * Research tracks, read in place.
 *
 * Each entry carries a real three-part account — problem, approach,
 * application — so the cards are wide and the text lives inline. No dialog:
 * gating a paragraph behind a click adds a step and hides the substance that
 * makes this section worth having.
 */
export function Research() {
  return (
    <Section id="research">
      <Container>
        <SectionHeader
          index="03"
          eyebrow="Core Machine Learning"
          title="Research tracks."
          lede="Outcome-driven investigations sitting underneath the applied work — what the problem was, how it was approached, and where it lands."
          className="mb-14"
        />

        <RevealGroup className="grid grid-cols-1 gap-3 xl:grid-cols-2" stagger={0.06}>
          {research.map((item, i) => (
            <ResearchCard key={item.id} item={item} index={i} />
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

function ResearchCard({ item, index }: { item: ResearchProject; index: number }) {
  const isLast = index === research.length - 1;

  return (
    <motion.article
      variants={revealVariants}
      className={cn(
        "on-dark group card-surface relative flex flex-col overflow-hidden rounded-md",
        // An odd count leaves a gap; the final entry takes the full row.
        isLast && research.length % 2 === 1 && "xl:col-span-2",
      )}
    >
      <div
        aria-hidden
        className="relative h-28 shrink-0 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.02]"
      >
        <ResearchPlate motif={item.motif} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="doto text-[10px] text-accent">R-{pad(index + 1)}</span>
            <Badge variant="outline">{item.domain}</Badge>
          </div>
          <div>
            <h3 className="doto text-[clamp(0.95rem,1.5vw,1.15rem)] leading-tight font-semibold text-fg">
              {item.title}
            </h3>
            <p className="mt-1.5 font-mono text-[12px] text-fg-muted">{item.subtitle}</p>
          </div>
        </header>

        <dl className="flex flex-col gap-4">
          <Block label="Problem" body={item.problem} />
          <Block label="Approach" body={item.approach} />
          <Block label="Application" body={item.application} accent />
        </dl>
      </div>
    </motion.article>
  );
}

function Block({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div className="grid gap-1.5 border-t border-line pt-3.5 first:border-t-0 first:pt-0">
      <dt className={cn("doto text-[9px]", accent ? "text-accent" : "text-fg-faint")}>{label}</dt>
      <dd className="text-[0.86rem] leading-relaxed text-fg-muted">{body}</dd>
    </div>
  );
}

/** Five plot motifs, one per track. Monochrome with a single accent mark. */
function ResearchPlate({ motif }: { motif: ResearchMotif }) {
  const Motif = MOTIFS[motif];
  return (
    <div className="absolute inset-0 bg-[#08080b]">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, #000 0%, transparent 88%)",
        }}
      />
      <svg
        viewBox="0 0 480 120"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <Motif />
      </svg>
    </div>
  );
}

const STROKE = "rgb(255 255 255 / 0.28)";
const STROKE_SOFT = "rgb(255 255 255 / 0.16)";

/** Lateral movement across a device graph. */
function Topology() {
  const nodes = [
    [78, 40],
    [148, 78],
    [214, 34],
    [284, 74],
    [352, 38],
    [414, 80],
  ] as const;
  return (
    <>
      <polyline
        points={nodes.map(([x, y]) => `${x},${y}`).join(" ")}
        stroke={STROKE_SOFT}
        strokeWidth="1"
      />
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === nodes.length - 1 ? 4.5 : 3}
          fill={i === nodes.length - 1 ? "var(--accent)" : STROKE}
        />
      ))}
      <path d="M414 80 l18 -12 m0 0 l-8 0 m8 0 l0 8" stroke="var(--accent)" strokeWidth="1.2" />
    </>
  );
}

/** Surface texture contours around a face region. */
function Contours() {
  return (
    <>
      {[46, 34, 23, 13].map((r, i) => (
        <ellipse
          key={r}
          cx="240"
          cy="62"
          rx={r * 1.5}
          ry={r}
          stroke={i === 3 ? "var(--accent)" : STROKE_SOFT}
          strokeWidth={i === 3 ? 1.3 : 0.9}
        />
      ))}
      <line x1="240" y1="6" x2="240" y2="116" stroke={STROKE_SOFT} strokeWidth="0.8" strokeDasharray="2 6" />
    </>
  );
}

/** Pen dynamics — one continuous stroke with pressure nodes. */
function Stroke() {
  return (
    <>
      <path
        d="M64 84 C 104 22, 132 104, 172 58 S 234 20, 268 76 S 330 104, 366 44 S 410 58, 428 70"
        stroke="var(--accent)"
        strokeWidth="1.4"
      />
      <path
        d="M64 96 C 108 44, 138 112, 176 74 S 238 40, 272 88 S 332 112, 368 60"
        stroke={STROKE_SOFT}
        strokeWidth="0.9"
        strokeDasharray="3 5"
      />
      {[
        [172, 58],
        [268, 76],
        [366, 44],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.6" fill="var(--accent)" />
      ))}
    </>
  );
}

/** Frequency-domain artefacts. */
function Spectrum() {
  const bars = [16, 30, 22, 44, 58, 36, 72, 50, 26, 42, 20, 34, 48, 24, 38];
  return (
    <>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={62 + i * 24}
          y={100 - h}
          width="5"
          height={h}
          rx="1"
          fill={i === 6 ? "var(--accent)" : STROKE}
        />
      ))}
      <line x1="56" y1="102" x2="428" y2="102" stroke={STROKE_SOFT} strokeWidth="0.8" />
    </>
  );
}

/** Local silos reporting parameters to one coordinator. */
function Federated() {
  const silos = [
    [92, 92],
    [166, 34],
    [314, 34],
    [388, 92],
  ] as const;
  return (
    <>
      <g stroke={STROKE_SOFT} strokeWidth="0.9" strokeDasharray="3 4">
        {silos.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2="240" y2="62" />
        ))}
      </g>
      {silos.map(([x, y], i) => (
        <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="2" stroke={STROKE} strokeWidth="1" />
      ))}
      <rect x="226" y="48" width="28" height="28" rx="3" stroke="var(--accent)" strokeWidth="1.2" />
      <rect x="233" y="55" width="14" height="14" rx="2" fill="var(--accent)" opacity="0.5" />
    </>
  );
}

const MOTIFS: Record<ResearchMotif, () => React.ReactElement> = {
  topology: Topology,
  contours: Contours,
  stroke: Stroke,
  spectrum: Spectrum,
  federated: Federated,
};
