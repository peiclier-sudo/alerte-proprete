"use client";

import Link from "next/link";
import { useState } from "react";

interface SectorCardProps {
  slug: string;
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
  slug, name, description,
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
        background: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: 14,
        border: `1px solid ${hovered ? `${color}50` : "rgba(228,225,219,0.6)"}`,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 48px -12px ${color}20, 0 0 0 1px ${color}15, inset 0 0 60px -20px ${color}08`
          : "inset 0 1px 0 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.04)",
        minHeight: 360,
      }}
    >
      {/* gradient accent line at top */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: hovered ? "70%" : "50%",
          height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          borderRadius: "0 1px 1px 0",
          transition: "width .4s cubic-bezier(.16,1,.3,1)",
        }}
      />

      {/* background number */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -24, right: -12,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 180, fontWeight: 700,
          color: hovered ? `${color}10` : "rgba(0,0,0,.02)",
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
        {/* name */}
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26, letterSpacing: "-0.02em",
          fontWeight: 700,
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
          fontFamily: "'JetBrains Mono', monospace",
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
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12, fontWeight: 500,
          color: hovered ? color : "#0f0f0f",
          transition: "color .3s ease",
        }}>
          {/* colored dot that appears on hover */}
          <span style={{
            width: 4, height: 4, borderRadius: "50%",
            background: color,
            opacity: hovered ? 1 : 0,
            transition: "opacity .3s ease",
            flexShrink: 0,
          }} />
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
