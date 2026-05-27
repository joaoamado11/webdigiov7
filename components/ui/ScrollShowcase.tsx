"use client";

import { useEffect, useRef, useState } from "react";

interface ShowcaseItem {
  tag: string;
  title: string;
  description: string;
  accent: string;
}

const items: ShowcaseItem[] = [
  {
    tag: "AI Automation",
    title: "Intelligent workflow orchestration.",
    description:
      "Automate repetitive tasks, route decisions intelligently, and let your team focus on what matters — strategy and creativity.",
    accent: "#7c5cfc",
  },
  {
    tag: "Real-time Analytics",
    title: "Live dashboards and actionable insights.",
    description:
      "Monitor every metric as it happens. Custom dashboards, predictive alerts, and reports that actually make sense.",
    accent: "#3db5b0",
  },
  {
    tag: "Seamless Integrations",
    title: "Connect your entire stack effortlessly.",
    description:
      "From CRM to ERP, from email to SMS — StackPilot plugs into your existing tools without breaking a sweat.",
    accent: "#f59e4b",
  },
  {
    tag: "Enterprise Security",
    title: "Bank-grade protection, built-in.",
    description:
      "SOC 2 compliant, end-to-end encryption, role-based access control, and audit logs. Sleep well at night.",
    accent: "#4b9cf5",
  },
  {
    tag: "Scale Globally",
    title: "Multi-region, zero friction.",
    description:
      "Deploy across continents with sub-100ms latency. Auto-scaling infrastructure that grows with you, not against you.",
    accent: "#e8608f",
  },
];

function Visual({ item, active }: { item: ShowcaseItem; active: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s ease",
        borderRadius: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Abstract gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 40%, ${item.accent}22 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 60%, ${item.accent}18 0%, transparent 55%),
                       linear-gradient(160deg, #0f172a 0%, #1a1f2e 50%, #0d1117 100%)`,
        }}
      />
      {/* Floating orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${item.accent}30 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: "50%",
          height: "35%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${item.accent}20 0%, transparent 65%)`,
          filter: "blur(50px)",
        }}
      />
      {/* Geometric accent line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${item.accent}40, transparent)`,
        }}
      />
      {/* Central shape */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 80,
          height: 80,
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          background: `linear-gradient(135deg, ${item.accent}50, ${item.accent}15)`,
          boxShadow: `0 0 60px ${item.accent}20`,
        }}
      />
      {/* Tag label */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "8%",
          padding: "6px 16px",
          borderRadius: 9999,
          background: `${item.accent}18`,
          border: `1px solid ${item.accent}30`,
          color: item.accent,
          fontSize: 12,
          fontFamily: "ui-monospace, monospace",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {item.tag}
      </div>
    </div>
  );
}

export default function ScrollShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const ratios: number[] = new Array(items.length).fill(0);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1) ratios[idx] = entry.intersectionRatio;
        });
        // Pick the card with the highest intersection ratio.
        let best = 0;
        let bestIdx = 0;
        ratios.forEach((r, i) => {
          if (r > best) {
            best = r;
            bestIdx = i;
          }
        });
        setActiveIndex(bestIdx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    cardRefs.current.forEach((el) => {
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="glass-section" style={{ padding: "6rem 0" }}>
      {/* Section header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto 3.5rem auto",
          padding: "0 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#7c5cfc",
          }}
        >
          Our Services
        </div>
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#0e1410",
            margin: 0,
          }}
        >
          Everything you need
          <br />
          to scale your business
        </h2>
      </div>

      <div
        className="showcase-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          padding: "0 2rem",
          alignItems: "start",
        }}
      >
        {/* Left — sticky visual panel */}
        <div className="showcase-sticky" style={{ position: "sticky", top: "6rem" }}>
          <div
            className="glass-panel"
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4/5",
              overflow: "hidden",
            }}
          >
            {items.map((item, i) => (
              <Visual key={i} item={item} active={i === activeIndex} />
            ))}
          </div>
        </div>

        {/* Right — scrollable cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`glass-card ${i === activeIndex ? "active" : ""}`}
              style={{ position: "relative", padding: "2rem 2rem 2rem 2.5rem", minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              {/* Accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "15%",
                  bottom: "15%",
                  width: 4,
                  borderRadius: "0 4px 4px 0",
                  background: item.accent,
                  opacity: i === activeIndex ? 1 : 0.3,
                  transition: "opacity 0.4s ease",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: item.accent,
                  marginBottom: "0.75rem",
                }}
              >
                {item.tag}
              </span>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "#0e1410",
                  lineHeight: 1.3,
                  margin: 0,
                  marginBottom: "0.75rem",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  color: "#3c4237",
                  margin: 0,
                  maxWidth: "42ch",
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
