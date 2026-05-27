"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const cards = [
  { title: "Web Development", subtitle: "Next.js · React · Tailwind", accent: "#7c5cfc", icon: "</>" },
  { title: "Mobile Apps", subtitle: "iOS · Android · Cross-platform", accent: "#3db5b0", icon: "📱" },
  { title: "AI & Automation", subtitle: "Chatbots · LLMs · RAG", accent: "#f59e4b", icon: "🤖" },
  { title: "Cloud & DevOps", subtitle: "AWS · Docker · CI/CD", accent: "#4b9cf5", icon: "☁️" },
  { title: "UX & Brand Design", subtitle: "Figma · Design systems", accent: "#e8608f", icon: "🎨" },
  { title: "Performance", subtitle: "Core Web Vitals · SEO", accent: "#a78bfa", icon: "⚡" },
  { title: "E-commerce", subtitle: "Shopify · Stripe · Payments", accent: "#34d399", icon: "🛒" },
  { title: "Consulting", subtitle: "Architecture · Strategy", accent: "#fb923c", icon: "💡" },
];

const RADIUS = 340;
const STEP = 360 / cards.length;

export default function OrbitCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [entranceProgress, setEntranceProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) { setEntranceProgress(1); return; }
      setEntranceProgress(Math.max(0, Math.min(1, -rect.top / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (orbitRef.current) {
      const current = parseFloat(orbitRef.current.style.animationDuration || "60");
      const boost = Math.max(20, current - Math.abs(e.deltaY) * 0.05);
      orbitRef.current.style.animationDuration = boost + "s";
      clearTimeout((orbitRef.current as any)._timer);
      (orbitRef.current as any)._timer = setTimeout(() => {
        if (orbitRef.current) orbitRef.current.style.animationDuration = "60s";
      }, 2000);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{ position: "relative", height: "300vh" }}
      onWheel={onWheel}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", perspective: 1000,
      }}>
        <div style={{
          position: "absolute", top: "5rem", left: "50%", transform: "translateX(-50%)",
          zIndex: 10, textAlign: "center",
          opacity: Math.min(1, entranceProgress * 3),
          transition: "opacity 0.3s linear",
        }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c5cfc", marginBottom: "0.75rem" }}>
            Our Expertise
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#0e1410", margin: 0 }}>
            Technologies we orbit around
          </h2>
        </div>

        <div ref={orbitRef} style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-15deg)",
          animation: "orbit-spin 60s linear infinite",
        }}>
          <style>{`
            @keyframes orbit-spin {
              from { transform: rotateX(-15deg) rotateY(0deg); }
              to { transform: rotateX(-15deg) rotateY(360deg); }
            }
          `}</style>

          <div style={{ position: "relative", transformStyle: "preserve-3d", width: 0, height: 0 }}>
            {cards.map((card, i) => {
              const delay = i * 0.04;
              const peak = 0.5 + delay * 0.3;
              const dist = Math.abs(entranceProgress - peak);
              const maxDist = Math.max(peak, 1 - peak);
              const normDist = Math.min(1, dist / maxDist);
              const eased = 1 - (normDist < 0.5
                ? 2 * normDist * normDist
                : 1 - Math.pow(-2 * normDist + 2, 2) / 2);

              const spiralY = (1 - eased) * 400;
              const spiralZ = (1 - eased) * 300;
              const s = 0.3 + eased * 0.7;
              const blur = (1 - eased) * 6;

              return (
                <div key={card.title} style={{
                  position: "absolute",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${STEP * i}deg) translateZ(${RADIUS}px)`,
                  width: 0, height: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    position: "absolute",
                    width: 200,
                    padding: "1.25rem",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(84,66,55,0.08)",
                    borderRadius: 14,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column", gap: "0.6rem",
                    opacity: eased,
                    filter: `blur(${blur}px)`,
                    transform: `
                      translateY(${-spiralY}px)
                      translateZ(${spiralZ}px)
                      scale(${s})
                    `,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: card.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {card.icon}
                    </div>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0e1410", lineHeight: 1.2, margin: 0 }}>{card.title}</h3>
                    <p style={{ fontSize: "0.75rem", color: "#8a8a8a", lineHeight: 1.3, margin: 0 }}>{card.subtitle}</p>
                    <div style={{ width: "100%", height: 2, borderRadius: 1, background: card.accent, opacity: 0.4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
