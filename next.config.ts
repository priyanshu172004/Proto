import path from "node:path";
import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * Deliberately no Content-Security-Policy here: the Cal.com embed injects a
 * script and an iframe from app.cal.com, and Next/Framer emit inline styles, so
 * a CSP has to be written and then actually tested against the booking dialog.
 * DEPLOYMENT.md carries a starting policy to opt into once verified — shipping
 * an untested CSP silently breaks the one conversion path on the page.
 */
const securityHeaders = [
  // Vercel terminates TLS; tell browsers never to try plain HTTP again.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never needs to be framed by anyone else.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // The floating dev badge overlaps the bottom-centre navigation.
  devIndicators: false,
  // Several lockfiles live above this folder; pin the root so Turbopack does
  // not infer the Desktop directory as the workspace.
  turbopack: { root: path.resolve(process.cwd()) },
  // Do not leak the framework version in response headers.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
