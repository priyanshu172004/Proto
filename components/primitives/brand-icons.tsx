import type { SVGProps } from "react";

/**
 * lucide dropped brand marks, and mixing an icon-font brand set with a stroke
 * icon set never quite matches. These are drawn to sit at the same optical
 * weight as the lucide glyphs used elsewhere.
 */

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function LeetCodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.48 0a1.37 1.37 0 0 0-.98.42L7.2 5.79l-4.6 4.7a5.66 5.66 0 0 0-1.55 3.1 6.02 6.02 0 0 0 .17 2.5 6.1 6.1 0 0 0 1.5 2.5l4.05 4.13a5.9 5.9 0 0 0 4.25 1.72 5.9 5.9 0 0 0 4.24-1.72l3.35-3.42a1.37 1.37 0 0 0-.02-1.94 1.37 1.37 0 0 0-1.94.02l-3.35 3.42a3.17 3.17 0 0 1-2.28.9 3.17 3.17 0 0 1-2.29-.9l-4.04-4.13a3.3 3.3 0 0 1-.8-1.34 3.24 3.24 0 0 1-.09-1.34 2.9 2.9 0 0 1 .8-1.58l4.6-4.7 5.3-5.37a1.37 1.37 0 0 0-1-2.34Zm-3.4 8.3a1.37 1.37 0 0 0 0 2.75h11.1a1.37 1.37 0 0 0 0-2.75h-11.1Z" />
      <path d="M9.7 4.8a1.37 1.37 0 0 0-.97 2.35l3.83 3.9a1.37 1.37 0 0 0 1.96-1.92l-3.83-3.9a1.37 1.37 0 0 0-.99-.43Z" />
    </svg>
  );
}
