# Priyanshu Srivastava — Portfolio

A single-page portfolio built as one design system: dark-first, Doto as the
display face, a WebGL field behind the hero, and Framer Motion used where it
carries meaning rather than everywhere it can.

```bash
npm install
npm run assets     # only after adding/removing photos in /pictures
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Re-processes `/pictures` → `/public/images` and regenerates `data/gallery.ts` |

---

## Environment

Everything is optional — the site builds and runs with no `.env` at all.

**`.env.example` is a template; Next.js never reads it.** Copy it first:

```bash
cp .env.example .env.local
```

| Variable | Effect when set | Behaviour when unset |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, Open Graph, sitemap, robots | Falls back to a placeholder domain |
| `NEXT_PUBLIC_CAL_LINK` | Contact CTA opens an embedded Cal.com scheduler. Accepts a handle (`you/30min`) or a full `https://cal.com/...` URL — the host is stripped before it reaches the embed | CTA becomes “Request a call” and opens a prefilled email |
| `GITHUB_TOKEN` | Contribution calendar comes straight from GitHub GraphQL | Falls back to a public contributions mirror (same 12 months, no auth), then to ~14 weeks of public events — and the card labels whichever it used |

A classic token with no scopes is enough for public contribution data.

---

## Editing content

No content lives in JSX. Everything is a typed module in `data/`.

| File | Holds |
|---|---|
| `data/profile.ts` | Name, roles, tagline, summary, education, interests, books |
| `data/projects.ts` | The 8 projects — copy, features, stack, repo, bento span, visual key |
| `data/research.ts` | The 5 ML research tracks — title, subtitle, domain, problem / approach / application |
| `data/stack.ts` | Technologies and the domains each belongs to |
| `data/achievements.ts` | Open-source programmes and hackathon results |
| `data/experience.ts` | Roles and dates |
| `data/blog.ts` | Posts |
| `data/socials.ts` | Links and email |
| `data/gallery.ts` | **Generated** — do not hand-edit; run `npm run assets` |

**Add a project** — push one object into `projects`:

```ts
{
  id: "new-project",
  title: "NEW_PROJECT",
  category: "Domain · Domain",
  tagline: "One line for the card face.",
  description: "Full copy for the detail dialog.",
  features: ["…"],
  stack: ["…"],
  github: "https://github.com/…",
  status: "in-progress",        // optional
  visual: "analytics",          // see ProjectVisual
  span: "1x1",                  // 1x1 | 2x1 | 2x2
}
```

**Add a blog post** — push one object into `posts` in `data/blog.ts`. Empty the
array and the section falls back to a designed empty state rather than filler.

**Add photos** — drop them in `/pictures`, run `npm run assets`. The script
optimises them, generates blur placeholders, and rewrites the manifest with
real dimensions so nothing shifts on load.

---

## Architecture notes

- **Server Components by default.** `"use client"` sits as deep in the tree as
  possible. The activity section is a server component that fetches GitHub and
  LeetCode at build and revalidates hourly.
- **One WebGL context** for the whole site (`components/ui/shader-background.tsx`).
  The 21st.dev "Mesh drift" recipe, dialled well under its defaults and held at
  ~35% opacity. It pauses when off-screen or when the tab is hidden, caps DPR at
  2 with a 2M-fragment budget, and releases the context on unmount. Falls back
  to a static CSS gradient when WebGL is unavailable.
- **Motion tokens live in `lib/motion.ts`.** Every animated component imports
  from there, which is what keeps twelve sections feeling like one page.
- **`prefers-reduced-motion` is a real branch**, not a CSS afterthought: the
  shader freezes, the cursor unmounts, the pinned gallery becomes a native snap
  carousel, and the typing effect renders instantly.
- **`.on-dark`** (in `globals.css`) pins the dark palette for content sitting on
  a dark generated visual, so project and research cards stay legible in light
  mode instead of going dark-on-dark.
- **Browser state uses `useSyncExternalStore`** (`lib/client-hooks.ts`) rather
  than `useState` + `useEffect`, avoiding a cascading render on every mount.
- **Modals carry `data-lenis-prevent`.** Lenis calls `preventDefault` on wheel
  events document-wide, so without that attribute a dialog's own
  `overflow-y-auto` never scrolls and long content is unreachable.

## Content integrity

Nothing on this site is invented. There are no placeholder metrics, no articles
falsely attributed, and no fabricated activity graphs — when a live feed cannot
be reached, the card renders an empty state and links to the profile instead.

One item is worth a second look before going live:

1. **The ML/AI stack list** was extended beyond the originally supplied names
   (Keras, Scikit-learn, OpenCV, Transformers, LangChain/LangGraph, spaCy,
   NLTK, Matplotlib, SciPy, Docker). Confirmed for inclusion — remove any entry
   in `data/stack.ts` that stops being accurate.
