import type { ProjectVisual } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Generated project visuals — deliberately spare.
 *
 * Each plate is near-black, a faint grid, and one thin line-art motif that
 * says what the project does. No colour washes, no stacked gradients: an
 * AI-native product shelf should read as instrumentation, and the restraint
 * is what keeps eight cards from turning into eight competing posters.
 *
 * A single accent line per plate carries the identity; everything else is
 * white at low alpha.
 */

type Props = { className?: string };

const LINE = "rgb(255 255 255 / 0.30)";
const LINE_SOFT = "rgb(255 255 255 / 0.16)";

function Plate({ children, className }: Props & { children: React.ReactNode }) {
  return (
    <div className={cn("absolute inset-0 bg-[#08080a]", className)}>
      {/* One very low pool of accent, top-left, to keep the plate from reading flat. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(105% 80% at 18% 0%, rgb(16 185 129 / 0.10) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.6) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(85% 75% at 40% 25%, #000 0%, transparent 100%)",
        }}
      />
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {children}
      </svg>
    </div>
  );
}

/** Detection: one framed subject, one travelling scan line. */
function Vision() {
  return (
    <Plate>
      <rect x="150" y="86" width="100" height="112" stroke={LINE} strokeWidth="1" />
      <path
        d="M150 96 v-10 h14 M250 96 v-10 h-14 M150 188 v10 h14 M250 188 v10 h-14"
        stroke="var(--accent)"
        strokeWidth="1.2"
      />
      <line
        x1="120"
        y1="0"
        x2="280"
        y2="0"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0.85"
        className="motion-safe:[animation:plate-scan_6s_ease-in-out_infinite]"
      />
      <style>{`@keyframes plate-scan{0%,100%{transform:translateY(92px)}50%{transform:translateY(192px)}}`}</style>
    </Plate>
  );
}

/** Agents: five satellites, one core, thin spokes. */
function Agents() {
  const nodes = [
    [126, 104],
    [274, 100],
    [108, 200],
    [292, 196],
    [200, 232],
  ] as const;
  return (
    <Plate>
      <g stroke={LINE_SOFT} strokeWidth="1">
        {nodes.map(([x, y], i) => (
          <line key={i} x1="200" y1="150" x2={x} y2={y} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={LINE} />
      ))}
      <circle cx="200" cy="150" r="16" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="200" cy="150" r="3.5" fill="var(--accent)" />
    </Plate>
  );
}

/** Documents: three sheets in light perspective, one line highlighted. */
function Documents() {
  return (
    <Plate>
      <g transform="translate(126 62) skewY(-6)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * -10} ${i * 34})`}>
            <rect
              width="158"
              height="104"
              rx="4"
              stroke={i === 0 ? LINE : LINE_SOFT}
              strokeWidth="1"
            />
            {[0, 1, 2].map((line) => (
              <line
                key={line}
                x1="18"
                y1={28 + line * 20}
                x2={line === 2 ? 96 : 140}
                y2={28 + line * 20}
                stroke={i === 0 && line === 0 ? "var(--accent)" : LINE_SOFT}
                strokeWidth="1"
              />
            ))}
          </g>
        ))}
      </g>
    </Plate>
  );
}

/** Resume: a single document skeleton. */
function Resume() {
  return (
    <Plate>
      <g transform="translate(140 52)">
        <rect width="120" height="196" rx="4" stroke={LINE} strokeWidth="1" />
        <circle cx="28" cy="30" r="9" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="46" y1="26" x2="98" y2="26" stroke={LINE} strokeWidth="1.4" />
        <line x1="46" y1="36" x2="78" y2="36" stroke={LINE_SOFT} strokeWidth="1" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="18"
            y1={66 + i * 18}
            x2={i % 2 === 0 ? 102 : 74}
            y2={66 + i * 18}
            stroke={LINE_SOFT}
            strokeWidth="1"
          />
        ))}
        <line x1="18" y1="172" x2="52" y2="172" stroke="var(--accent)" strokeWidth="1.6" />
      </g>
    </Plate>
  );
}

/** Transfer: one arc, one packet in flight. */
function Transfer() {
  return (
    <Plate>
      <path d="M78 206 C 150 92, 250 92, 322 206" stroke={LINE} strokeWidth="1" />
      <path
        d="M78 206 C 158 132, 242 132, 322 206"
        stroke={LINE_SOFT}
        strokeWidth="1"
        strokeDasharray="2 7"
      />
      <circle cx="78" cy="206" r="9" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="322" cy="206" r="9" stroke={LINE} strokeWidth="1.2" />
      <circle r="3.5" fill="var(--accent)">
        <animateMotion dur="4.2s" repeatCount="indefinite" path="M78 206 C 150 92, 250 92, 322 206" />
      </circle>
    </Plate>
  );
}

/** Analytics: one plotted series over a bare axis pair. */
function Analytics() {
  const pts = [
    [60, 208],
    [104, 178],
    [148, 190],
    [192, 142],
    [236, 154],
    [280, 108],
    [324, 86],
  ] as const;
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  return (
    <Plate>
      <g stroke={LINE_SOFT} strokeWidth="1">
        <line x1="46" y1="62" x2="46" y2="236" />
        <line x1="46" y1="236" x2="344" y2="236" />
      </g>
      <path d={d} stroke="var(--accent)" strokeWidth="1.3" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={i === pts.length - 1 ? "var(--accent)" : LINE} />
      ))}
    </Plate>
  );
}

/** Churn: cohorts holding, one falling away. */
function Churn() {
  return (
    <Plate>
      <path d="M56 118 C 140 126, 240 134, 344 140" stroke={LINE_SOFT} strokeWidth="1" />
      <path d="M56 142 C 140 152, 240 164, 344 176" stroke={LINE_SOFT} strokeWidth="1" />
      <path d="M56 166 C 148 188, 246 216, 344 238" stroke="var(--accent)" strokeWidth="1.3" />
      <circle cx="344" cy="238" r="3.5" fill="var(--accent)" />
      <circle cx="344" cy="238" r="10" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
    </Plate>
  );
}

/** Terminal: a prompt, a few lines, a caret. */
function Terminal() {
  const widths = [84, 148, 112, 62];
  return (
    <Plate>
      <g transform="translate(104 96)">
        {widths.map((w, i) => (
          <g key={i} transform={`translate(0 ${i * 24})`}>
            <text
              x="0"
              y="4"
              fill={i === 0 ? "var(--accent)" : LINE}
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              ›
            </text>
            <line x1="16" y1="0" x2={16 + w} y2="0" stroke={LINE_SOFT} strokeWidth="1.4" />
          </g>
        ))}
        <rect
          x="16"
          y={widths.length * 24 - 6}
          width="8"
          height="12"
          fill="var(--accent)"
          className="motion-safe:[animation:caret-blink_1.2s_steps(1)_infinite]"
        />
      </g>
    </Plate>
  );
}

const VISUALS: Record<ProjectVisual, () => React.ReactElement> = {
  vision: Vision,
  agents: Agents,
  documents: Documents,
  resume: Resume,
  transfer: Transfer,
  analytics: Analytics,
  churn: Churn,
  terminal: Terminal,
};

export function ProjectVisualPlate({ variant }: { variant: ProjectVisual }) {
  const Visual = VISUALS[variant];
  return <Visual />;
}
