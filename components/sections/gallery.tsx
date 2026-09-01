"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container, SectionHeader } from "@/components/primitives/section";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLenisLock } from "@/components/layout/smooth-scroll";
import { gallery, type GalleryFrame } from "@/data/gallery";
import { spring } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

/**
 * Horizontal scroll gallery.
 *
 * A tall pinned container converts vertical scroll into horizontal travel,
 * springed so it glides instead of snapping frame to frame. On touch, and under
 * reduced motion, the pin is abandoned entirely for a native snap carousel —
 * a half-working pin is worse than no pin.
 */
export function Gallery() {
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => setPinned(query.matches && !reduced);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduced]);

  return (
    <section id="gallery" className="relative scroll-mt-24 py-(--spacing-section)">
      <Container>
        <SectionHeader
          index="08"
          eyebrow="Camera"
          title="Off the clock."
          lede="A running roll of frames — the other thing I pay attention to."
          className="mb-12"
        />
      </Container>

      {pinned ? (
        <PinnedTrack onOpen={setOpen} />
      ) : (
        <SnapTrack onOpen={setOpen} />
      )}

      <Lightbox index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </section>
  );
}

function PinnedTrack({ onOpen }: { onOpen: (i: number) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), spring.glide);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "320vh" }} className="relative">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <motion.div
          aria-hidden
          style={{ opacity: labelOpacity }}
          className="pointer-events-none absolute top-1/2 left-8 z-20 -translate-y-1/2"
        >
          <p className="doto text-[11px] text-fg-faint">
            {gallery.length} frames →
          </p>
        </motion.div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-5 px-8">
          {gallery.map((frame, i) => (
            <Frame key={frame.id} frame={frame} index={i} onOpen={() => onOpen(i)} progress={scrollYProgress} />
          ))}
          <EndPlate />
        </motion.div>

        <ScrubBar progress={scrollYProgress} />
      </div>
    </div>
  );
}

function ScrubBar({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  return (
    <div aria-hidden className="absolute bottom-12 left-1/2 h-px w-40 -translate-x-1/2 bg-line">
      <motion.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
    </div>
  );
}

/** Varied heights keep the strip from reading as a contact sheet. */
function heightFor(frame: GalleryFrame, index: number) {
  if (frame.orientation === "landscape") return 340;
  return index % 3 === 0 ? 480 : index % 3 === 1 ? 420 : 450;
}

function Frame({
  frame,
  index,
  onOpen,
  progress,
}: {
  frame: GalleryFrame;
  index: number;
  onOpen: () => void;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const height = heightFor(frame, index);
  const width = Math.round((height * frame.width) / frame.height);
  // Counter-drift on the inner image reads as depth as the strip travels.
  const drift = useTransform(progress, [0, 1], ["-4%", "4%"]);

  return (
    <figure className="group relative shrink-0">
      <button
        type="button"
        onClick={onOpen}
        data-cursor-target="media"
        aria-label={`Open frame ${pad(index + 1)}`}
        className="relative block overflow-hidden rounded-sm border border-line bg-surface-2"
        style={{ height, width }}
      >
        <motion.div style={{ x: drift, scale: 1.1 }} className="absolute inset-0">
          <Image
            src={frame.src}
            alt=""
            fill
            sizes="(max-width: 1024px) 70vw, 30vw"
            placeholder="blur"
            blurDataURL={frame.blurDataURL}
            loading="lazy"
            className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
          />
        </motion.div>
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40"
        />
      </button>
      <figcaption className="doto mt-3 flex items-center gap-2 text-[9px] text-fg-faint">
        <span className="text-accent">{pad(index + 1)}</span>
        <span aria-hidden className="h-px w-4 bg-line-strong" />
        <span>/ {gallery.length}</span>
      </figcaption>
    </figure>
  );
}

function EndPlate() {
  return (
    <div className="flex h-[420px] w-[22rem] shrink-0 flex-col justify-end rounded-sm border border-dashed border-line-strong p-6">
      <p className="doto text-[10px] text-fg-faint">End of roll</p>
      <p className="mt-2 font-mono text-[11px] text-fg-muted">
        {gallery.length} frames · shot on the move
      </p>
    </div>
  );
}

/** Touch and reduced-motion path: native snap scrolling, no pin, no transform. */
function SnapTrack({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="mask-fade-x overflow-x-auto pb-4">
      <div className="flex w-max snap-x snap-mandatory items-end gap-4 px-5 sm:px-8">
        {gallery.map((frame, i) => {
          const height = frame.orientation === "landscape" ? 260 : 340;
          const width = Math.round((height * frame.width) / frame.height);
          return (
            <figure key={frame.id} className="shrink-0 snap-center">
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`Open frame ${pad(i + 1)}`}
                className="relative block overflow-hidden rounded-sm border border-line bg-surface-2"
                style={{ height, width }}
              >
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  sizes="70vw"
                  placeholder="blur"
                  blurDataURL={frame.blurDataURL}
                  loading="lazy"
                  className="object-cover"
                />
              </button>
              <figcaption className="doto mt-2 text-[9px] text-fg-faint">
                <span className="text-accent">{pad(i + 1)}</span> / {gallery.length}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

function Lightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const isOpen = index !== null;
  useLenisLock(isOpen);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + gallery.length) % gallery.length);
    },
    [index, onNavigate],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const frame = index !== null ? gallery[index] : null;
  const next = index !== null ? gallery[(index + 1) % gallery.length] : null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-h-[92dvh] max-w-4xl overflow-y-auto border-0 bg-transparent p-0 shadow-none"
        showClose={false}
      >
        <DialogTitle className="sr-only">
          {frame ? `Frame ${pad((index ?? 0) + 1)} of ${gallery.length}` : "Gallery"}
        </DialogTitle>

        {frame && (
          <div
            className="relative"
            onTouchStart={(e) => {
              const startX = e.touches[0].clientX;
              const el = e.currentTarget;
              const end = (ev: TouchEvent) => {
                const dx = ev.changedTouches[0].clientX - startX;
                if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
                el.removeEventListener("touchend", end);
              };
              el.addEventListener("touchend", end);
            }}
          >
            <Image
              src={frame.src}
              alt=""
              width={frame.width}
              height={frame.height}
              placeholder="blur"
              blurDataURL={frame.blurDataURL}
              sizes="(max-width: 768px) 92vw, 70vw"
              className="mx-auto max-h-[76dvh] w-auto rounded-sm object-contain"
            />
            {/* Preload the neighbour so arrow-key navigation never flashes. */}
            {next && (
              <Image
                src={next.src}
                alt=""
                width={16}
                height={16}
                className="pointer-events-none absolute size-px opacity-0"
                aria-hidden
              />
            )}

            <div className="mt-4 flex items-center justify-between">
              <p className="doto text-[10px] text-fg-muted">
                Frame <span className="text-accent">{pad((index ?? 0) + 1)}</span> / {gallery.length}
              </p>
              <div className="flex gap-2">
                <LightboxButton onClick={() => go(-1)} label="Previous frame">
                  <ChevronLeft className="size-4" />
                </LightboxButton>
                <LightboxButton onClick={() => go(1)} label="Next frame">
                  <ChevronRight className="size-4" />
                </LightboxButton>
                <LightboxButton onClick={onClose} label="Close gallery">
                  <span className="doto text-[10px]">Esc</span>
                </LightboxButton>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LightboxButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-9 min-w-9 place-items-center rounded-full border border-line bg-surface/80 px-3",
        "text-fg-muted backdrop-blur-md transition-colors hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
