"use client";

import Link from "next/link";

interface SectorCardProps {
  slug: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
  colorLight: string;
  borderRadius: string;
}

export default function SectorCard({ slug, emoji, name, description, color, colorLight, borderRadius }: SectorCardProps) {
  return (
    <Link
      href={`/${slug}`}
      style={{
        textDecoration: "none", color: "inherit",
        display: "block", padding: "36px 28px",
        background: "#fff",
        borderRadius,
        border: "1px solid #e4e1db",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = colorLight;
        el.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "#fff";
        el.style.borderColor = "#e4e1db";
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 20 }}>{emoji}</div>
      <h2 style={{
        fontFamily: "'Instrument Serif', serif", fontSize: 24,
        color: "#0f0f0f", letterSpacing: "-0.02em", marginBottom: 8,
      }}>
        {name}
      </h2>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "#7a7a7a", marginBottom: 20 }}>
        {description}
      </p>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
        color, display: "flex", alignItems: "center", gap: 4,
      }}>
        Découvrir <span>&rarr;</span>
      </div>
    </Link>
  );
}
