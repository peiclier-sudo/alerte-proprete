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
        display: "block",
        borderRadius: 15,
        padding: 1,
        background: hovered
          ? `conic-gradient(from var(--border-angle), ${color}, ${color}30, ${color})`
          : "rgba(228,225,219,0.5)",
        animation: hovered ? "mmBorderSpin 3s linear infinite" : "none",
        transition: "background 0.4s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transitionProperty: "transform, background",
        transitionDuration: "0.4s",
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* inner card */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "36px 30px 32px",
        background: hovered ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        minHeight: 358,
        boxShadow: hovered
          ? `0 4px 8px ${color}12, 0 16px 32px ${color}15, 0 32px 64px ${color}10`
          : "0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.01)",
        transition: "box-shadow .4s ease, background .4s ease",
      }}>
        {/* gradient accent line at top */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: hovered ? "70%" : "40%",
            height: 2,
            background: `linear-gradient(90deg, ${color}, transparent)`,
            borderRadius: "0 1px 1px 0",
            transition: "width .5s cubic-bezier(.16,1,.3,1)",
          }}
        />

        {/* background number */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -28, right: -14,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 190, fontWeight: 700,
            color: hovered ? `${color}0c` : "rgba(0,0,0,.018)",
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
              display: "inline-block",
              width: hovered ? 24 : 16,
              height: 1,
              background: hovered ? color : "#d4d4d4",
              transition: "all .3s ease",
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
            {/* colored dot */}
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: color,
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0)",
              transition: "all .3s cubic-bezier(.16,1,.3,1)",
              flexShrink: 0,
            }} />
            Découvrir
            <span style={{
              display: "inline-block",
              transition: "transform .3s ease",
              transform: hovered ? "translateX(6px)" : "translateX(0)",
            }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
