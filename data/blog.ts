export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  author: string;
  /** Abstract visual key — the cards generate their own imagery. */
  visual: "aurora" | "prism" | "spectrum";
  href?: string;
};

/**
 * Empty by design.
 *
 * No articles have been supplied, and inventing posts attributed to Priyanshu
 * would be a fabricated credential. The section renders a designed empty state
 * until real entries land here — adding one is a single object push.
 */
export const posts: Post[] = [
  {
    slug: "luck-and-risk-are-siblings",
    title:
      "Luck and Risk are siblings: two sides of the same coin where the same action can lead to opposite outcomes based on forces beyond your control",
    excerpt:
      "On the uncomfortable symmetry between fortune and misfortune — and why the same decision can look like genius or recklessness depending on forces nobody controls.",
    category: "Reading",
    readingTime: 4,
    publishedAt: "Sep 1, 2025",
    author: "Morgan Housel",
    visual: "aurora",
  },
];

export const hasPosts = posts.length > 0;
