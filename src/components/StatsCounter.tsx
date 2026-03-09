"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 900, suffix: "+", label: "opportunités détectées / mois" },
  { target: 2, suffix: " min", label: "au lieu de 2h de veille" },
  { target: 1, suffix: " marché", label: "gagné rembourse 10 ans" },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedNumber({ target, suffix, duration = 1500 }: { target: number; suffix: string; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCurrent(Math.round(easeOutCubic(progress) * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="mm-grad-text" style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 28, fontWeight: 600,
      letterSpacing: "-0.02em",
    }}>
      {current}{suffix}
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="mm-stats" style={{
      animation: "mmReveal .8s cubic-bezier(0.16,1,0.3,1) .8s both",
      marginTop: 48,
    }}>
      {STATS.map(({ target, suffix, label }) => (
        <div key={label}>
          <AnimatedNumber target={target} suffix={suffix} />
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, color: "#b0b0b0",
            letterSpacing: ".05em", marginTop: 6,
          }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
