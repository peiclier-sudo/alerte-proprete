"use client";

import { useEffect, useRef, useState } from "react";

const OPPORTUNITIES = [
  { time: "Il y a 2h", title: "Nettoyage locaux — Mairie de Nantes", score: 94, color: "#0EA5E9", amount: "180K€", dept: "44" },
  { time: "Il y a 5h", title: "Gardiennage SSIAP — CHU Bordeaux", score: 87, color: "#EA580C", amount: "320K€", dept: "33" },
  { time: "Il y a 8h", title: "Entretien espaces verts — CC du Bassin de Thau", score: 72, color: "#10B981", amount: "95K€", dept: "34" },
  { time: "Il y a 12h", title: "Nettoyage vitrerie — Conseil départemental 69", score: 68, color: "#0EA5E9", amount: "110K€", dept: "69" },
];

export default function RecentOpportunities() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      marginTop: 48,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.8s ease 1s, transform 0.8s ease 1s",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, fontWeight: 600, color: "#b0b0b0",
        textTransform: "uppercase", letterSpacing: ".12em",
        marginBottom: 14,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#10B981",
          animation: "mmPulse 2s ease infinite",
        }} />
        Détectés récemment
      </div>
      <div style={{
        display: "flex", flexDirection: "column", gap: 1,
        background: "rgba(228,225,219,0.3)",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        {OPPORTUNITIES.map((opp, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 16px",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-12px)",
            transition: `opacity 0.5s ease ${1.2 + i * 0.15}s, transform 0.5s ease ${1.2 + i * 0.15}s`,
          }}>
            {/* time ago */}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: "#b0b0b0",
              whiteSpace: "nowrap", minWidth: 70,
            }}>{opp.time}</span>

            {/* title */}
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, color: "#3d3d3d",
              flex: 1, minWidth: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{opp.title}</span>

            {/* amount + dept */}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: "#999",
              whiteSpace: "nowrap",
            }}>{opp.amount} · {opp.dept}</span>

            {/* score badge */}
            <div style={{
              width: 34, height: 26, borderRadius: 6,
              background: `${opp.color}12`,
              border: `1.5px solid ${opp.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, fontWeight: 600, color: opp.color,
              }}>{opp.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
