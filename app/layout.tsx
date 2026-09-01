import type { Metadata, Viewport } from "next";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { GrainOverlay } from "@/components/layout/grain-overlay";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

const Cursor = dynamic(() => import("@/components/layout/cursor").then((m) => m.Cursor));

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://priyanshusrivastava.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — AI/ML Engineer & Software Engineer`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Priyanshu Srivastava builds AI-native systems, intelligent software, machine learning applications, and full-stack products.",
  keywords: [
    "Priyanshu Srivastava",
    "AI engineer",
    "machine learning engineer",
    "software engineer",
    "full stack developer",
    "AI-native systems",
  ],
  authors: [{ name: profile.name, url: socials.github }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: profile.name,
    title: `${profile.name} — AI/ML Engineer & Software Engineer`,
    description:
      "Priyanshu Srivastava builds AI-native systems, intelligent software, machine learning applications, and full-stack products.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — AI/ML Engineer & Software Engineer`,
    description:
      "Priyanshu Srivastava builds AI-native systems, intelligent software, machine learning applications, and full-stack products.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI/ML Engineer & Software Engineer",
  email: `mailto:${socials.email}`,
  url: SITE_URL,
  sameAs: [socials.github, socials.linkedin, socials.leetcode],
  alumniOf: profile.education.map((e) => ({ "@type": "EducationalOrganization", name: e.institution })),
  knowsAbout: profile.knowsAbout,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} antialiased`}
    >
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <a
              href="#about"
              className="doto sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-[11px] focus:text-accent-fg"
            >
              Skip to content
            </a>
            {children}
            <GrainOverlay />
            <Cursor />
          </SmoothScroll>
        </ThemeProvider>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
