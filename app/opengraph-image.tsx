import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — AI/ML Engineer & Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Uses the site's own visual language: near-black ground, one emerald pool,
 * a fine grid, and the name as the entire composition.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050506",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 60% at 22% 0%, rgba(16,185,129,0.32) 0%, transparent 62%), radial-gradient(50% 50% at 88% 18%, rgba(163,230,53,0.16) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 4,
            color: "#8a8f98",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#10b981" }}>●</span>
          {profile.disciplines.join("  ·  ")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 700,
              color: "#ededed",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#8a8f98",
              maxWidth: 900,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            AI-native systems, intelligent software, and full-stack products.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#5a5f68",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>github.com/priyanshu172004</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
