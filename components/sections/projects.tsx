"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/primitives/brand-icons";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { BentoCard, CardBody, CardScrim, CardVisual, type BentoSpan } from "@/components/primitives/bento-card";
import { RevealGroup } from "@/components/primitives/reveal";
import { ProjectVisualPlate } from "@/components/primitives/project-visual";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLenisLock } from "@/components/layout/smooth-scroll";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  useLenisLock(Boolean(open));

  return (
    <Section id="work">
      <Container>
        <SectionHeader
          index="02"
          eyebrow="Selected Work"
          title="Products with models at the centre."
          lede="Eight systems where the intelligence is the architecture, not a feature bolted to the side."
          className="mb-14"
        />

        <RevealGroup
          className="grid auto-rows-[12rem] grid-cols-2 gap-3 md:grid-cols-4"
          stagger={0.06}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={() => setOpen(project)} />
          ))}
        </RevealGroup>
      </Container>

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>{open && <ProjectDetail project={open} />}</DialogContent>
      </Dialog>
    </Section>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const isFeature = project.span === "2x2";

  return (
    <BentoCard span={project.span as BentoSpan} interactive className="on-dark min-h-0">
      <CardVisual>
        <ProjectVisualPlate variant={project.visual} />
      </CardVisual>

      <CardScrim height={isFeature ? "58%" : "72%"} />

      <CardBody className={cn(isFeature && "gap-3 p-6 sm:p-7")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{project.category}</Badge>
          {project.status === "in-progress" && (
            <Badge variant="progress">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-accent-hi motion-safe:animate-[pulse-dot_1.8s_ease-in-out_infinite]"
              />
              In Progress
            </Badge>
          )}
        </div>

        <h3
          className={cn(
            "doto leading-tight font-semibold text-fg",
            isFeature ? "text-[clamp(1.15rem,2vw,1.6rem)]" : "text-[clamp(0.95rem,1.4vw,1.1rem)]",
          )}
        >
          {project.title}
        </h3>

        <p
          className={cn(
            "text-fg-muted",
            isFeature ? "max-w-[42ch] text-[0.95rem]" : "line-clamp-2 text-caption",
          )}
        >
          {project.tagline}
        </p>

        {isFeature && (
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-surface/50 px-2 py-0.5 font-mono text-[10px] text-fg-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="doto inline-flex items-center gap-1 text-[10px] text-fg-faint transition-colors group-hover:text-accent">
            Details
            <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${project.title} on GitHub`}
              className="relative z-30 grid size-7 place-items-center rounded-full text-fg-faint transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <GithubIcon className="size-3.5" />
            </a>
          )}
        </div>
      </CardBody>

      {/* Full-card hit target. Sits below the GitHub link in stacking order. */}
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 z-20 cursor-pointer rounded-md focus-visible:outline-2"
        aria-label={`Open details for ${project.title}`}
        data-cursor-target="interactive"
      />
    </BentoCard>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-5">
      <div className="relative -mx-6 -mt-6 h-44 overflow-hidden sm:-mx-8 sm:-mt-8">
        <ProjectVisualPlate variant={project.visual} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{project.category}</Badge>
        {project.status === "in-progress" && <Badge variant="progress">In Progress</Badge>}
      </div>

      <DialogTitle className="doto text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-fg">
        {project.title}
      </DialogTitle>

      <DialogDescription className="text-[0.98rem] leading-relaxed text-fg-muted">
        {project.description}
      </DialogDescription>

      {project.features.length > 0 && (
        <div>
          <p className="doto mb-3 text-[10px] text-fg-faint">Capabilities</p>
          <ul className="flex flex-col gap-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-[0.92rem] text-fg-muted">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="doto mb-3 text-[10px] text-fg-faint">Stack</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-fg-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="doto inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2.5 text-[11px] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          <GithubIcon className="size-3.5" />
          View repository
          <ArrowUpRight className="size-3" />
        </a>
      )}
    </article>
  );
}
