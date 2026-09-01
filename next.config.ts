import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge overlaps the bottom-centre navigation.
  devIndicators: false,
  // Several lockfiles live above this folder; pin the root so Turbopack does
  // not infer the Desktop directory as the workspace.
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600],
  },
};

export default nextConfig;
