/**
 * Fixed film grain + vignette. Server component — it is pure markup.
 * This is the layer that keeps large dark areas from reading as flat.
 */
export function GrainOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: "var(--grain-opacity)" }}>
        <filter id="grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgb(0 0 0 / 0.28) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
