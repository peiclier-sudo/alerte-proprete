"use client";

import Link from "next/link";
import { useState } from "react";

interface SectorCardProps {
  slug: string;
  emoji: string;
  name: string;
  description: string;
  color: string;
  colorLight: string;
  colorDark: string;
  index: number;
  stat: string;
  statLabel: string;
}

export default function SectorCard({
  slug, emoji, name, description,
  color, colorLight, colorDark,
  index, stat, statLabel,
}: SectorCardProps) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        padding: "36px 30px 32px",
        background: hovered ? colorLight : "#fff",
        borderRadius: 14,
        border: `1px solid ${hovered ? color : "#e8e5df"}`,
        borderTop: `3px solid ${color}`,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 48px -16px ${color}22, 0 0 0 1px ${color}18`
          : "0 1px 3px rgba(0,0,0,.04)",
        minHeight: 360,
      }}
    >
      {/* background number */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -16, right: -6,
          fontFamily: "'Instrument Serif', serif",
          fontSize: 150,
          color: hovered ? `${color}14` : "rgba(0,0,0,.025)",
          lineHeight: 1,
          transition: "color .4s ease",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {num}
      </span>

      <div style={{
        position: "relative", zIndex: 1,
        flex: 1, display: "flex", flexDirection: "column",
      }}>
        {/* emoji */}
        <div style={{ fontSize: 38, marginBottom: 20, lineHeight: 1 }}>
          {emoji}
        </div>

        {/* name */}
        <h3 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 26, letterSpacing: "-0.02em",
          color: "#0f0f0f", lineHeight: 1.15, marginBottom: 10,
        }}>
          {name}
        </h3>

        {/* description */}
        <p style={{
          fontSize: 13, lineHeight: 1.65, color: "#888",
          marginBottom: 24, flex: 1,
        }}>
          {description}
        </p>

        {/* stat */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, letterSpacing: ".04em",
          color: hovered ? colorDark : "#b0b0b0",
          transition: "color .3s ease",
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            display: "inline-block", width: 16, height: 1,
            background: hovered ? color : "#d4d4d4",
            transition: "background .3s ease",
          }} />
          {stat} {statLabel}
        </div>

        {/* cta */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, fontWeight: 600,
          color: hovered ? color : "#0f0f0f",
          transition: "color .3s ease",
        }}>
          Découvrir
          <span style={{
            display: "inline-block",
            transition: "transform .3s ease",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
          }}>→</span>
        </div>
      </div>
    </Link>
  );
}
