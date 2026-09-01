# MASTER BUILD PROMPT — PRIYANSHU SRIVASTAVA / PORTFOLIO

> Paste this entire file as the first message to Claude Opus 5 in the project root
> `c:\Users\Priyanshu Srivastava\Desktop\Portfolio_Pri`.

---

## 0. ROLE & MANDATE

You are simultaneously the **creative director**, **design-systems architect**, and **senior Next.js engineer** for this build. You are not generating a template. You are shipping one specific person's portfolio.

**Build it. Do not describe it.** Scaffold the app, install dependencies, write every component, wire the data, run `npm run build`, fix every error, then do a polish pass. Pseudo-code, `// TODO`, and lorem ipsum are build failures.

**Success condition:** a senior engineer at a frontier AI lab lands on this site, scrolls once, and concludes *"this person builds real systems."* Not *"this person found a nice template."*

---

## 1. NON-NEGOTIABLES (read before writing any code)

| # | Rule |
|---|------|
| 1 | **Never fabricate a fact.** No CGPA, accuracy scores, dataset names, star counts, user counts, revenue, publications, employment duties, or awards beyond §6. Missing data → design an honest empty state or omit the element. Never a fake number. |
| 2 | **One design system, not a component gallery.** shadcn/ui and 21st.dev are raw material. Every imported component gets re-skinned to the tokens in §3 before it ships. If a section looks like a library demo, it is wrong. |
| 3 | **Motion is hierarchical, not ambient.** The hero earns cinematic motion. A hackathon list item earns a 200 ms fade. Animating everything equally destroys the sense that anything matters. |
| 4 | **Exactly one WebGL context** for the whole site. Mounted once, paused when off-screen or when `document.hidden`. |
| 5 | **`prefers-reduced-motion` is a real code path**, not an afterthought — shader → static gradient, cursor off, parallax off, horizontal scroll → vertical grid, transitions ≤150 ms opacity only. |
| 6 | **Content completeness is verified by count**, not by vibes. See the §11 ledger: 8 projects, 5 research projects, 3 education entries, 5 books, 3 open-source, 5 hackathons, 3 experience roles, 22 gallery photos. Missing one = incomplete build. |
| 7 | **Doto is a display face, never body copy.** See §3.2. Setting paragraphs in a dot-matrix font is the single fastest way to make this look amateur. |

---

## 2. STACK & ARCHITECTURE

```
Next.js (latest stable, App Router)  ·  TypeScript strict  ·  Tailwind CSS v4
shadcn/ui  ·  Framer Motion  ·  Lenis  ·  next-themes  ·  lucide-react
Raw WebGL2 (no three.js — the shader is a single fullscreen quad)
```

**Rules**
- Server Components by default. `"use client"` only where interaction, refs, or browser APIs demand it — push the boundary as deep into the tree as possible.
- All content lives in typed modules under `data/`. Zero content hard-coded in JSX. Adding a project later = one object in one array.
- Dynamic-import every heavy client visual with `ssr: false` (shader, cursor, gallery lightbox).
- No dependency added for a single visual effect that 30 lines of CSS can do.

**Target structure** (improve if you have a genuinely better production layout):

```
app/            layout.tsx · page.tsx · globals.css · opengraph-image.tsx
components/
  ui/           shadcn primitives + liquid-morph-floating-menu.tsx + shader-background.tsx
  layout/       nav, cursor, smooth-scroll-provider, theme-provider, grain-overlay
  sections/     hero, about, projects, research, stack, achievements,
                experience, informatics, gallery, blog, contact, footer
  primitives/   bento-card, section-header, reveal, magnetic, doto-label, marquee
data/           profile.ts projects.ts research.ts stack.ts achievements.ts
                experience.ts gallery.ts blog.ts socials.ts
lib/            utils.ts motion.ts (shared variants + tokens) github.ts leetcode.ts
public/images/  gallery/ · priyanshu.jpg · og/
```

---

## 3. DESIGN SYSTEM (define first, in `globals.css`, before any section)

### 3.1 Color — dark is primary, light is a first-class citizen

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#050506` | `#FAFAF9` |
| `--surface` | `#0C0C0E` | `#FFFFFF` |
| `--surface-2` | `#141417` | `#F4F4F2` |
| `--border` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.09)` |
| `--fg` | `#EDEDED` | `#0A0A0A` |
| `--fg-muted` | `#8A8F98` | `#585F68` |
| `--accent` | `#10B981` | `#047857` |
| `--accent-hi` | `#34D399` | `#059669` |
| `--accent-glow` | `rgba(16,185,129,.18)` | `rgba(4,120,87,.14)` |

Emerald is a **scalpel**, not a paint bucket: active nav state, focus rings, one metric, one hover edge, the shader. Everything else is monochrome. A green-tinted page reads as a template; a monochrome page with three green moments reads as designed.

Every card sits on `--surface` with a 1px `--border`, radius 20px (4 / 12 / 20 / 28 scale), and a barely-there top-edge highlight `inset 0 1px 0 rgba(255,255,255,.04)`.

### 3.2 Typography — the Doto rule

```
Display / labels / numerals → Doto (variable 100–900)
    https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap
    load via next/font/google, variable --font-doto
Body / UI                   → Geist Sans (fallback Inter Tight)
Code / metadata             → Geist Mono (fallback JetBrains Mono)
```

**Doto is allowed on:** the hero name, section index markers (`01 / ABOUT`), eyebrow labels, stat numerals, nav items, tags, timeline years, gallery frame counters.
**Doto is banned from:** every paragraph, every project description, every blog excerpt, anything over ~40 characters.

Doto styling: `uppercase`, `letter-spacing: 0.08em`, weight 500–700. Its dot-matrix grid *is* the robotic/technical signal — it lands hardest against clean neutral body copy, and disappears entirely if everything is Doto.

Fluid scale via `clamp()`: hero `clamp(3rem, 11vw, 10rem)` · h2 `clamp(2rem, 4.5vw, 3.5rem)` · body `1.0625rem/1.65` · caption `0.8125rem`. Max measure 68ch.

### 3.3 Motion tokens (`lib/motion.ts`, imported everywhere)

```ts
duration: { fast: .2, base: .35, slow: .6, cinematic: .9 }
ease:     { out: [.22,1,.36,1], inOut: [.65,0,.35,1] }
spring:   { soft: {stiffness:180,damping:26,mass:.9},
            snap: {stiffness:400,damping:34} }
stagger:  .06
```

Reveal default: `opacity 0→1`, `y 24→0`, `duration.slow`, `ease.out`, `viewport={{ once: true, margin: "-12% 0px" }}`.

**Motion hierarchy** — L1 micro (hover/focus, ≤200 ms) · L2 component (cards, tabs) · L3 section reveal · L4 hero. Never let an L1 element animate like an L4 element.

### 3.4 Texture
Full-page fixed grain overlay (SVG `feTurbulence`, ~3% opacity, `mix-blend-mode: overlay`, `pointer-events:none`) plus a soft radial vignette. This is what separates "premium" from "flat dark theme."

---

## 4. GLOBAL SYSTEMS

### 4.1 Liquid Morph Floating Menu — primary navigation
If `components/ui/liquid-morph-floating-menu.tsx` exists in the repo, **integrate the supplied source; do not rewrite a lesser version.** If it is absent, build to this spec:

- Fixed, bottom-center on desktop (`bottom: 2rem`), top-right compact pill on mobile.
- Collapsed = pill with a Doto wordmark + hamburger. Expanded = the item list, with the container **morphing width/height via a single `layout` transition** and `spring.soft` — the morph is the entire point, so no cross-fade between two fixed sizes.
- Animated background layer using `layoutId` for the active-item indicator.
- Per-character hover animation on labels (stagger 0.02, y-shift + weight/opacity shift).
- Hamburger → close via animated SVG path/rotation, not an icon swap.
- Closes on outside click, on `Escape`, and on nav selection. Full keyboard nav with visible focus rings. `aria-expanded`, `role="navigation"`.
- Backdrop: `backdrop-blur-xl`, `bg-surface/70`, 1px border, soft ambient shadow.
- Items: `HOME · ABOUT · WORK · RESEARCH · STACK · EXPERIENCE · GALLERY · BLOG · CONTACT`
- Active section tracked by IntersectionObserver and reflected in the indicator.
- The **theme toggle lives inside the expanded menu** as a sun/moon morph (animated path, not two icons).

### 4.2 Shader Background
If `components/ui/shader-background.tsx` exists, integrate it and **preserve its visibility/IntersectionObserver/DPR handling.** Otherwise implement a WebGL2 fullscreen-quad fragment shader:

- Animated multi-octave FBM/simplex flow field — slow, liquid, atmospheric.
- Palette: deep near-black base → emerald `#10B981` → lime-green highlight `#A3E635`, with a cool teal shadow. Light-mode variant: pale mint/sage on off-white, much lower contrast.
- Uniforms: `u_time`, `u_resolution`, `u_pointer` (lerped, subtle), `u_intensity`, `u_theme`.
- Post: grain, heavy blur/soft focus, contrast + saturation lift, vignette.
- Perf: DPR capped at 1.5 (1.0 on mobile), pause on `!isIntersecting || document.hidden`, `cancelAnimationFrame` + full GL teardown on unmount, `powerPreference:'low-power'`, no `preserveDrawingBuffer`.
- Fallback chain: no WebGL2 → WebGL1 → static CSS radial-gradient mesh. Reduced motion → freeze at `t=0`.
- **Do not substitute a CSS gradient for the shader.** It is a core identity element, not decoration.

### 4.3 Smooth Scrolling
Lenis, `lerp: 0.085`, `wheelMultiplier: 1`, `smoothWheel: true`, touch smoothing **off** (native momentum feels better on mobile). Single rAF loop shared with nothing else. Must `lenis.stop()` when a Dialog/Sheet opens and `lenis.start()` on close, and must not break anchor navigation or `Ctrl/Cmd+F`. Disabled entirely under reduced motion.

### 4.4 Custom Cursor
28px transparent circle, 1px `--fg` border at 60% opacity, `mix-blend-mode: difference`, spring-follow (`spring.soft`) with a tiny trailing dot. States: **default** → **hover-interactive** (scale 2.2, border fades, faint fill) → **text-hover** (collapse to a 2×24px I-beam) → **image-hover** (scale 3.4 + Doto `VIEW` label inside). Hidden on `(hover: none)`, touch devices, and reduced motion — and the native cursor must remain available for accessibility.

---

## 5. SECTION-BY-SECTION SPEC

Page order: **Nav → Hero → About → Work → Research → Stack → Signals → Experience → Informatics → Gallery → Blog → Contact → Footer.**

Every section gets a Doto index marker (`01 / ABOUT`) and generous rhythm: 128px mobile, 192px desktop.

### 5.1 HERO
- Shader background, full viewport, content on a `z-10` layer.
- **`PRIYANSHU SRIVASTAVA`** in Doto at `clamp(3rem,11vw,10rem)` — a real typing effect (per-character reveal with a blinking block caret, ~55 ms/char, caret persists ~800 ms then fades). Not a CSS width animation. Reduced motion → instant render.
- Beneath it, a **role rotator** that overlaps rather than replaces: `AnimatePresence mode="popLayout"`, outgoing exits `y:-40, opacity:0, filter:blur(8px)`, incoming enters `y:40, opacity:0, blur(8px)` → settled. 2.4 s dwell. Roles: `DEVELOPER · SOFTWARE ENGINEER · FULLSTACK · AI & ML`.
- Description, set in body face, max 60ch, word-staggered reveal after the name completes:

  > *I engineer AI-native systems from the ground up — combining intelligent models, software architecture, and automation to build products that are not just powered by AI, but fundamentally designed around it.*

- Scroll cue: thin animated line + Doto `SCROLL`.
- Optional restraint: one line of Doto micro-metadata in a corner (`AI/ML · SOFTWARE ENGINEERING · IN, PB`). Nothing more. The hero's power comes from space.

### 5.2 ABOUT — Bento Grid
Reference: attached bento imagery. Asymmetric, **never a uniform card grid**. Suggested 4-col desktop layout:

| Cell | Span | Content |
|---|---|---|
| Portrait | 1×2 tall | `/public/images/priyanshu.jpg` (3:4), duotone→color on hover, subtle parallax |
| Summary | 2×1 wide | 3–4 sentence intro (§6.1) |
| Education | 2×2 | Three-stop vertical timeline, Doto years, animated connector line drawn on scroll |
| Interests | 1×1 | Football + Reading, animated line icons |
| Recent Reads | 2×1 | 5 book spines / stacked cards, hover lifts and fans them |
| Location | 1×1 | `RAJPURA, PUNJAB · IN` + a live IST clock in Doto |

Cards: bottom-anchored gradient scrim + blur where an image sits behind text (reference image 2), hover = 1px border brightens toward `--accent`, image scales 1.03, content lifts 2px. Stagger the grid in on scroll.

### 5.3 WORK — Projects Bento (8 items)
Mixed spans — 2 hero cards (2×2), the rest 1×1 / 2×1. Each card:

- **Generated abstract visual**, never stock photography. Build each from CSS gradients + SVG + subtle canvas motifs matched to the project's domain (vision grid/scanline for SENTINAL_VISION, agent-node graph for CTHROUGHAI, document strata for DOCX.AI, transfer arcs for SWIFTSEND, analytics surfaces for RESX, cohort curves for CRMISED.IO, terminal glyphs for TRESSCURE, layout skeleton for RESUME.IO). Give each a distinct hue *within* the monochrome+emerald discipline.
- **Bottom blur treatment** exactly as in the attached reference: image fills the card, lower ~45% carries a `backdrop-blur` + gradient scrim, and the category / title / description sit inside that band, fully legible.
- Doto category pill · title · 2-line description · tech chips · GitHub link with an arrow that translates on hover · `IN PROGRESS` badge (pulsing dot) where applicable.
- Hover: card `y:-4`, image `scale:1.04`, scrim strengthens, border warms, arrow slides. `will-change` set only during hover.
- Click → shadcn `Dialog` with the full description, feature list, stack, and repo link. Trap focus, `Escape` closes, Lenis stops.

### 5.4 RESEARCH — Core Machine Learning (5 items)
Visually distinct from §5.3 so it doesn't read as "more projects": tighter grid, more instrument-panel than product-shot — plot-like SVG motifs, grid rules, monospace annotations, restrained color. Same bottom-blur card language.

**These five carry titles only (§6.6) — descriptions arrive later.** Design the card so the title alone is the composition: large Doto title, generated abstract visual, a Doto index (`R-01`…`R-05`), and negative space where the description will go. No invented domain tags, no placeholder sentences, no lorem. The visual does the work here.

### 5.5 STACK — make this the surprise section
Most portfolios dump logo grids here. Do not. Build a **Stack Matrix**:

- shadcn `Tabs` across domains: `LANGUAGES · FRONTEND · BACKEND · DATA & ML · INFRA & TOOLS`.
- Within a tab, technologies are chips in a dense grid. Switching tabs **morphs shared chips via `layoutId`** rather than fading the block — items that exist in both domains physically travel. This is the moment of delight.
- Hovering a chip dims its siblings to 35% and draws thin connector lines to related technologies (a small hand-authored adjacency map in `data/stack.ts`).
- Alongside: a shadcn **Chart** (Recharts radar or horizontal bar) showing *breadth by domain* — a count of technologies per category. Count only. **Never invent proficiency percentages.**
- Optional Doto ticker marquee of the full stack across the section base, `speed`-reduced on hover.

### 5.6 SIGNALS — Open Source + Hackathons (compact bento)
Two-column bento. Left: open-source contributions as badge cards. Right: hackathons as a ranked list — Doto placement (`1ST RUNNER-UP`, `RANK 194`, `FINALIST`, `TOP 10`, `REGIONAL`), organisation, year. Emerald accent reserved for the strongest result only. Numbers count up on first view (real numbers only).

### 5.7 EXPERIENCE — Timeline
Vertical timeline, scroll-linked progress line (`useScroll` + `useTransform` on `scaleY`), a node that fills emerald as each entry enters. Role · organisation · Doto date range · `PRESENT` pill for the current role. Keep descriptions to one factual line each — do not invent responsibilities.

### 5.8 INFORMATICS — GitHub + LeetCode
Two cards, real data, honest failure.

- **GitHub:** contribution heatmap for `priyanshu172004`. Server-side fetch in a Route Handler with `revalidate: 3600`; GitHub GraphQL with `GITHUB_TOKEN` from `.env.local` if present, else the public REST events endpoint, else a documented static fallback. Emerald 5-step intensity ramp matching the site palette.
- **LeetCode:** the green submission calendar for `Priyanshu_17_Srivastava` via a public community API, cached and revalidated the same way.
- **On fetch failure: render a designed empty state with a link to the profile.** Never fabricate a submission grid, streak, or problem count. Type the responses; never `any`. Document required env vars in `.env.example` and the README.

### 5.9 GALLERY — Camera / horizontal scroll
Photography section built from `/pictures` (22 gallery images + the portrait; mostly 3:4 portrait, with one landscape and one near-square — the layout must handle mixed aspect ratios without cropping faces).

- Pin a tall (`h-[300vh]`) container; `useScroll` on it drives `useTransform` translating a horizontal flex track from `0` to `-(trackWidth - viewportWidth)`. Wrap in `useSpring` (`spring.soft`) so it glides rather than snaps.
- Film-strip language: varied card heights, Doto frame counters (`FRAME 07 / 22`), thin rules between frames, a Doto section title pinned at the left edge that scrubs opacity as the track moves.
- Slight per-frame parallax on the inner `<img>` (opposite direction, ~8%) for depth.
- Click → lightbox (`Dialog`) with arrow-key + swipe navigation and a preloaded neighbour.
- **Mobile / reduced motion:** native horizontal snap-scroll carousel, or a vertical masonry grid. Never a broken pin.
- All images via `next/image`, `sizes` set correctly, `placeholder="blur"` with generated blurDataURL, first two `priority`, the rest lazy. Convert to WebP/AVIF at build; the raw JPEGs are ~1280px and must not ship unoptimised.

### 5.10 BLOG — Thoughts & Insights
Match the attached postcard reference exactly: dark rounded card · large abstract image with soft top-glow · Doto category pill · `· 7 min read` · bold multi-line title · muted excerpt · footer row `By / Published` split left–right.

Data-driven (`data/blog.ts`), MDX-ready. **Do not invent articles attributed to Priyanshu.** If no posts exist, ship a designed empty state (`FIRST POST IN PROGRESS`) or clearly-marked structural placeholders. Hover: image scale 1.05, card lift, glow intensify, arrow slide.

### 5.11 CONTACT
Headline: **`LET'S BUILD SOMETHING INTELLIGENT.`** in Doto, large. Sub: *Have an idea, research problem, or system that could benefit from intelligent engineering?*

- Primary CTA: **Book a call** — embed Cal.com (`@calcom/embed-react`, inline or popup) with the username in `NEXT_PUBLIC_CAL_LINK`. If unset, the button opens a mailto with a prefilled subject and the README documents the one-line setup. **No phone number was supplied — never invent a `tel:` link.**
- Secondary: email (click-to-copy with a Doto `COPIED` confirmation), LinkedIn, GitHub, LeetCode.
- Magnetic hover on the primary CTA (translate toward pointer, `spring.snap`, capped at 12px) — used exactly once on the page.

### 5.12 FOOTER
Oversized Doto wordmark `PRIYANSHU SRIVASTAVA` as a graphic base element, cropped by the viewport edge. Beneath: `AI/ML · SOFTWARE ENGINEERING · AI-NATIVE SYSTEMS`, social row, back-to-top (Lenis-animated), theme toggle, `© 2026`, and a live IST clock in Doto. Nothing more.

---

## 6. CONTENT LEDGER — verbatim source of truth

### 6.1 Identity
- **Name:** Priyanshu Srivastava
- **Roles (rotator):** Developer · Software Engineer · Fullstack · AI & ML
- **Hero description:** *I engineer AI-native systems from the ground up — combining intelligent models, software architecture, and automation to build products that are not just powered by AI, but fundamentally designed around it.*
- **About summary** (write in this register — technical, confident, zero filler; banned phrases: "passionate developer", "I love coding", "tech enthusiast"):
  > Computer Science engineer working at the intersection of machine learning research and production software. Currently building AI/ML systems as an R&D intern at ARI Simulations, with prior work spanning multi-agent document intelligence, computer-vision monitoring, and full-stack product engineering. Most interested in the layer where models stop being demos and start being infrastructure.

### 6.2 Education
| Stage | Institution | Location |
|---|---|---|
| Class X | Birla Vidya Mandir | Nainital, Uttarakhand |
| Class XII | Amity International School | Lucknow, Uttar Pradesh |
| B.E. Computer Science & Engineering | Chitkara University | Rajpura, Punjab, India |

### 6.3 Interests
Football · Reading

### 6.4 Recent Reads
1. The Subtle Art of Not Giving a F*ck
2. Surrounded by Psychopaths
3. The Psychology of Money
4. Think and Grow Rich
5. Atomic Habits

### 6.5 Projects (8) — use these descriptions

**SENTINAL_VISION** — `github.com/priyanshu172004/SENTINAL_AI` · *Computer Vision · Security*
> An intelligent visual monitoring system that converts raw camera streams into structured situational awareness. Rather than requiring continuous human observation, it performs real-time detection and tracking, scores deviations from learned normal activity, and escalates only genuine events — reducing operator load while improving response time to actual threats.
> **Features:** real-time multi-object detection and tracking · anomaly scoring against baseline activity · event-driven alerting with frame-level evidence capture · modular detector backbone for swappable models.
> *Stack: Python, OpenCV, PyTorch, YOLO, NumPy*

**CTHROUGHAI** — `github.com/priyanshu172004/CThroughAI` · *Multi-Agent Systems · RAG*
> A multi-agent document assessment and research platform that decomposes complex source material into specialist analyses. Five coordinated agents — Finance, Market, Risk, News, and Workflow & Implementation — evaluate a corpus in parallel, and an orchestration layer synthesises their outputs into a single decision-grade brief. An integrated agentic RAG chat layer allows the underlying documents to be interrogated conversationally, with responses grounded in retrieved passages.
> **Features:** five domain-specialised agents with an orchestration layer · agentic RAG retrieval with citation grounding · cross-agent synthesis into a unified assessment · conversational follow-up over the ingested corpus.
> *Stack: Python, LangChain/LangGraph, Vector DB, FastAPI, LLM APIs*

**RESUME.IO** — `github.com/priyanshu172004/Resume.io` · *Applied AI · Product*
> An AI-assisted resume builder that transforms unstructured career history into role-targeted, ATS-compatible documents. The system generates and refines section content against a supplied job description, enforces typographic and structural consistency, and surfaces alignment gaps before the document is exported.
> **Features:** AI content generation and rewriting · job-description keyword alignment · ATS-safe templating · live preview with export.

**DOCX.AI** — `github.com/priyanshu172004/Docx.AI` · *Document Intelligence · SaaS*
> A document intelligence SaaS for teams operating on high volumes of PDFs and long-form text. It handles ingestion, hierarchical summarisation, and retrieval-backed question answering, compressing document review from hours into minutes while keeping every answer traceable to its source passage.
> **Features:** multi-format ingestion pipeline · hierarchical summarisation · semantic search across a workspace · citation-linked answers · document and workspace management.

**SWIFTSEND** — `github.com/priyanshu172004/SwiftSend` · *Platform Engineering*
> A file management and sharing platform engineered for fast, reliable, permissioned transfer. Large uploads are chunked and resumable, links carry configurable expiry and access rules, and stored assets remain organised and retrievable rather than scattered across ad-hoc shares.
> **Features:** chunked, resumable uploads · expiring links with access control · real-time transfer progress · structured storage and shareable spaces.

**RESX** — *In Progress* · *Data Analysis · AI-Native Systems*
> A personalised, AI-native analysis system designed to behave like an analyst rather than a dashboard. It ingests a dataset, profiles its structure automatically, and returns a complete narrative account — distributions, relationships, anomalies, and recommended next steps — in natural language, supported by generated visualisations.

**CRMISED.IO** — *In Progress* · *Predictive Analytics · CRM*
> A customer relationship platform with predictive retention built into the core workflow. A churn-prediction model scores every account continuously and surfaces at-risk relationships together with their contributing factors, allowing commercial teams to intervene before revenue is lost rather than diagnosing it afterwards.
> **Features:** continuous churn scoring · feature-attribution explanations for each prediction · pipeline and contact management · segment-level analytics.
> *Stack: Python, XGBoost, Pandas, Scikit-learn, React*

**TRESSCURE** — `github.com/priyanshu172004/TRESSCURE-APP` · *Java · CLI Systems*
> A Java command-line application for structured hair-health management. It captures user profile and condition inputs, applies a rule-based assessment engine, and generates a personalised care regimen with longitudinal tracking of adherence and change over time.
> **Features:** rule-based assessment engine · personalised regimen generation · progress tracking across sessions · persistent local records · clean object-oriented domain model.
> *Stack: Java, OOP, File I/O*

### 6.6 Research — Core Machine Learning (5)

**Titles only. Descriptions will be supplied later by the user — do not write them, do not infer them, do not invent domains, methods, datasets, or results.**

1. IOT_VECTOR ATTACKS
2. MYCT
3. DEEPFAKE ML ANALYSIS
4. COMPUTER VISION_TCE
5. FEDTWIN

Build the section fully — cards, visuals, layout, motion — with the title rendered and the description field left as a typed optional (`description?: string`) that renders nothing when absent. The card design must look intentional and complete with the title alone, not like a card with a hole in it. Adding the five descriptions later must require editing only `data/research.ts`.

### 6.7 Technology Stack
**Languages:** Java · JavaScript · Python · SQL
**Frontend:** React · Next.js · HTML5 · CSS · Tailwind CSS
**Backend:** Node.js · Express · Django · Flask · Spring Boot · FastAPI
**Data & Storage:** MySQL · MongoDB · Redis · Firebase · BullMQ
**ML / AI:** PyTorch · TensorFlow · Keras · Scikit-learn · XGBoost · OpenCV · Hugging Face Transformers · LangChain · LangGraph · NLTK · spaCy · NumPy · Pandas · Seaborn · Matplotlib · SciPy
**Infra & Tools:** Nginx · Git · GitHub · Docker · Postman · Linux · Socket.io · Hibernate · Maven

**Concept tags** (render as a distinct Doto chip variant — capabilities, not tools): Deep Learning · Neural Networks · Transformers · NLP · Computer Vision · RAG · Multi-Agent Systems · Model Fine-Tuning · Feature Engineering · Time-Series Analysis · Federated Learning.

> Every entry above is confirmed by the user and ships as listed. Render all of them — do not prune, substitute, or "curate" the list down.

### 6.8 Open Source
- GirlScript Summer of Code 2025
- Open Source Connect India '25
- Hacktoberfest '25

### 6.9 Hackathons
| Event | Result |
|---|---|
| The AI Hiring Show (Rabbit AI) '25 | **First Runner-Up** |
| HackRx (Bajaj Finserv) '25 | Team Rank 194, All India |
| HackTheMountains '24 — Rajkot, Gujarat | Finalist |
| HackFest '24 — SAP, Coimbatore @ PSG iTech | Top 10 Finalist |
| Smart India Hackathon '24 | Regional Qualifier — Freelance Platform domain |

### 6.10 Experience
| Role | Organisation | Period |
|---|---|---|
| AI & ML Research and Development Intern | ARI Simulations | May 2025 — Present |
| Tech Lead *(former)* | ACM Student Chapter, Chitkara University | Jul 2025 — Dec 2025 |
| Full Stack Developer *(Freelance)* | FixYourHR.com | Apr 2025 — Jun 2025 |

### 6.11 Links
- GitHub — `https://github.com/priyanshu172004`
- LinkedIn — `https://www.linkedin.com/in/priyanshu-srivastava-417075317`
- LeetCode — `https://leetcode.com/u/Priyanshu_17_Srivastava/`
- Email — `srivastavapriyanshu17042004@gmail.com`

---

## 7. ASSETS ON DISK

```
/pictures/Priyanshu(Me).jpg      → public/images/priyanshu.jpg     (963×1280, about-bento portrait)
/pictures/shared image*.jpg (22) → public/images/gallery/frame-01..22.jpg
/info/*.html                     → prior prompt drafts. REFERENCE ONLY. Do not ship, do not import.
```

Rename gallery files deterministically, generate blur placeholders at build, and write the manifest (with per-image intrinsic width/height) into `data/gallery.ts` so the layout never causes CLS. Aspect mix: 20 portrait ≈3:4, 1 landscape ≈4:3, 1 ≈7:6 — the track must accommodate all three.

---

## 8. RESPONSIVE, ACCESSIBILITY, PERFORMANCE

**Responsive** — verify at 1920 / 1440 / 1280 / 1024 / 768 / 480 / 375. Mobile is a *redesign*, not a stack: bentos collapse to intentional 1–2 column rhythms with the hero cards leading, cursor off, shader at reduced resolution and intensity, horizontal gallery → snap carousel, nav → reachable thumb-zone pill. No horizontal page overflow at any width.

**Accessibility** — semantic landmarks, one `h1`, ordered heading levels, visible `:focus-visible` rings (emerald, 2px, 2px offset), full keyboard operability including the menu and lightbox, `aria-label` on every icon-only control, alt text on meaningful images and `alt=""` on decorative ones, body text ≥4.5:1 in both themes (verify `--fg-muted` in light mode explicitly), `aria-live` on the role rotator or `aria-hidden` with a static accessible name.

**Performance** — Lighthouse ≥95 performance / 100 accessibility on desktop. LCP <2.0s, CLS <0.05, INP <200ms. Shader and cursor dynamically imported. `next/image` everywhere with correct `sizes`. Animate only `transform`/`opacity`/`filter`. Zero layout thrash in scroll handlers. `font-display: swap` with explicit fallback metrics. No unused shadcn components left in the tree.

**SEO** — `metadata` export with title `Priyanshu Srivastava — AI/ML Engineer & Software Engineer`, description *"Priyanshu Srivastava builds AI-native systems, intelligent software, machine learning applications, and full-stack products."*, Open Graph + Twitter cards, a generated `opengraph-image.tsx` using the site's own visual language, JSON-LD `Person` schema, `sitemap.ts`, `robots.ts`. No keyword stuffing.

---

## 9. BUILD ORDER — with gates

Work in this order. Do not begin a phase until the previous one builds clean.

1. **Foundation** — scaffold Next.js + TS strict + Tailwind v4 + shadcn init. Write `globals.css` tokens, fonts, `lib/motion.ts`, `lib/utils.ts`. Gate: `npm run build` passes on an empty page.
2. **Shell** — theme provider, Lenis provider, grain overlay, cursor, liquid-morph nav, shader background. Gate: nav morphs, theme flips with no flash, shader runs at 60fps, scroll is smooth.
3. **Data layer** — every file in `data/` fully typed and populated from §6. Gate: counts verified against §11.
4. **Primitives** — `BentoCard` (span variants, image + scrim + blur, hover states), `SectionHeader`, `Reveal`, `DotoLabel`, `Magnetic`. Gate: one card renders correctly in all span variants and both themes.
5. **Sections** — hero → about → work → research → stack → signals → experience → informatics → gallery → blog → contact → footer. Build each to completion before starting the next.
6. **Assets** — copy, rename, optimise images; generate blur data; wire the gallery manifest.
7. **Integration** — GitHub/LeetCode route handlers with caching and fallbacks; Cal.com embed; `.env.example`; README.
8. **Responsive + a11y + reduced-motion pass** across every breakpoint.
9. **Performance pass** — bundle analysis, dynamic imports, image audit, Lighthouse.
10. **Final polish** — §10.

---

## 10. FINAL POLISH PASS (mandatory — do not skip)

Re-read the finished site as six different people and fix what each one would flag:

- **Creative director** — is there a coherent visual idea, or a sequence of effects?
- **Senior frontend engineer** — component boundaries, dead code, unnecessary client components, console warnings.
- **Hiring manager** — is the strongest work visible within 15 seconds of scrolling?
- **AI researcher** — does the research section read as rigorous, or decorative?
- **Designer** — spacing rhythm, optical alignment, line length, type hierarchy, the count of competing focal points per viewport.
- **Accessibility auditor** — keyboard-only traversal of the entire page, top to bottom, without a mouse.

Then check the details that separate good from exceptional: consistent hover timing across all cards, no double scrollbars, no flash of unstyled or wrong-theme content, section transitions that breathe, `::selection` styled, the scrollbar styled, favicon set, 404 page designed, and every external link carrying `rel="noopener noreferrer"`.

---

## 11. DEFINITION OF DONE

```
[ ] npm run build — zero errors, zero type errors, zero ESLint errors
[ ] Zero console errors or warnings at runtime
[ ] 8 projects · 5 research · 3 education · 5 books · 3 open-source
    · 5 hackathons · 3 experience · 22 gallery images — all rendered
[ ] Liquid-morph nav: morphs, keyboard-navigable, closes on outside click + Escape
[ ] Shader: renders, pauses off-screen, tears down on unmount, has a fallback
[ ] Dark + light both fully designed; no flash on load or toggle
[ ] Doto used only per §3.2 — zero paragraphs set in Doto
[ ] Typing effect, overlapping role rotator, custom cursor, Lenis all working
[ ] Horizontal gallery works on desktop AND degrades correctly on mobile
[ ] prefers-reduced-motion path verified by actually enabling it
[ ] GitHub + LeetCode: real data or a designed empty state — no fabricated numbers
[ ] Cal.com booking CTA functional or documented in README
[ ] Lighthouse ≥95 / 100 a11y desktop
[ ] Full keyboard traversal completes with visible focus at every stop
[ ] No horizontal overflow at 375px
[ ] README documents setup, env vars, and how to add a project or blog post
```

---

## 12. CREATIVE DIRECTION — the one paragraph that matters

It should feel like **a digital laboratory built by an engineer who thinks in systems** — minimal, intelligent, technical, cinematic. Restraint carries it: deep near-black, one green, generous space, a dot-matrix face used like a label-maker on precision instruments, and motion that behaves like physics rather than decoration. Give it two or three genuine moments of surprise — the nav morph, the stack chips travelling between domains, the gallery gliding sideways — and keep everything between those moments quiet. Loud and memorable are not the same thing.

Do not build a template. Build the portfolio of **Priyanshu Srivastava — AI/ML engineer, software engineer, builder of AI-native systems.**

**Now build it.**
