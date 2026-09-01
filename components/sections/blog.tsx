"use client";

import { motion } from "framer-motion";
import { Container, Section, SectionHeader } from "@/components/primitives/section";
import { RevealGroup } from "@/components/primitives/reveal";
import { Badge } from "@/components/ui/badge";
import { posts, type Post } from "@/data/blog";
import { profile } from "@/data/profile";
import { revealVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Editorial post cards built to the supplied reference: large abstract image
 * with a soft top glow, category pill, reading time, multi-line title, excerpt,
 * and a split By / Published footer.
 *
 * `data/blog.ts` is empty on purpose — inventing articles under Priyanshu's
 * byline would be a fabricated credential — so the section ships the real card
 * anatomy plus a designed empty state, and lights up the moment a post lands.
 */
export function Blog() {
  return (
    <Section id="blog">
      <Container>
        <SectionHeader
          index="09"
          eyebrow="Thoughts & Insights"
          title="Notes from the build."
          lede="Working notes on AI-native architecture, model behaviour, and the engineering underneath."
          className="mb-14"
        />

        {posts.length > 0 ? (
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </RevealGroup>
        ) : (
          <EmptyState />
        )}
      </Container>
    </Section>
  );
}

const GLOWS: Record<Post["visual"], string> = {
  aurora:
    "radial-gradient(80% 60% at 50% 0%, rgb(163 230 53 / 0.55) 0%, rgb(16 185 129 / 0.4) 32%, rgb(8 47 73 / 0.6) 62%, transparent 100%)",
  prism:
    "radial-gradient(70% 60% at 62% 4%, rgb(129 140 248 / 0.5) 0%, rgb(236 72 153 / 0.32) 40%, transparent 100%)",
  spectrum:
    "radial-gradient(75% 60% at 38% 0%, rgb(34 211 238 / 0.45) 0%, rgb(16 185 129 / 0.35) 44%, transparent 100%)",
};

export function PostCard({ post }: { post: Post }) {
  const Wrapper = post.href ? "a" : "div";

  return (
    <motion.article variants={revealVariants}>
      <Wrapper
        {...(post.href ? { href: post.href, target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "group card-surface flex h-full flex-col gap-5 rounded-lg p-4 transition-colors",
          post.href && "hover:border-line-strong",
        )}
        data-plate="dark"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-black">
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-105"
            style={{ background: GLOWS[post.visual] }}
          />
          <div aria-hidden className="absolute inset-0 backdrop-blur-2xl" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(60% 50% at 50% 0%, rgb(255 255 255 / 0.14), transparent 70%)" }}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
          <div className="flex items-center gap-3">
            <Badge>{post.category}</Badge>
            <span className="font-mono text-[11px] text-fg-muted">
              · {post.readingTime} min read
            </span>
          </div>

          <h3 className="text-[clamp(1.15rem,1.6vw,1.4rem)] leading-tight font-semibold text-balance text-fg">
            {post.title}
          </h3>

          <p className="text-[0.9rem] text-fg-muted">{post.excerpt}</p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div>
              <p className="doto text-[9px] text-fg-faint">By</p>
              <p className="mt-1 text-[0.9rem] font-medium text-fg">{post.author}</p>
            </div>
            <div className="text-right">
              <p className="doto text-[9px] text-fg-faint">Published</p>
              <p className="mt-1 text-[0.9rem] font-medium text-fg">{post.publishedAt}</p>
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6 }}
      className="card-surface relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-lg p-6 sm:p-10"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 -top-32 h-80 opacity-60"
        style={{ background: GLOWS.aurora, filter: "blur(48px)" }}
      />

      <div className="relative">
        <Badge variant="progress">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-accent-hi motion-safe:animate-[pulse-dot_1.8s_ease-in-out_infinite]"
          />
          No posts yet
        </Badge>
      </div>

      <div className="relative max-w-[52ch]">
        <h3 className="text-[clamp(1.5rem,3.4vw,2.4rem)] leading-tight font-semibold text-balance text-fg">
          Nothing published here yet.
        </h3>
        <p className="mt-4 text-fg-muted">
          This section is wired to a real content pipeline rather than filled with placeholder
          articles. The card layout, typography and motion are finished — the moment a post is
          added to the data file, it renders here.
        </p>
      </div>

      <div className="relative mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
        <span className="doto text-[10px] text-fg-faint">
          Author · <span className="text-fg-muted">{profile.name}</span>
        </span>
        <span className="doto text-[10px] text-fg-faint">
          Status · <span className="text-accent">Awaiting first entry</span>
        </span>
      </div>
    </motion.div>
  );
}
