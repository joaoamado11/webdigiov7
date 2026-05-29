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

// Sticky offset for the left card and JS-driven release sync for the title.
const STICKY_TOP_REM = 15;

export default function ScrollShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [entryP, setEntryP] = useState(0);
  const [titleOffset, setTitleOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-driven entry + title-release sync.
  // entryP: rises from bottom of viewport into final position.
  // titleOffset: as the grid scrolls past the sticky-left release point, push
  // the title up by the same amount so title + left card move together.
  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      const grid = gridRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const startTop = window.innerHeight * 0.5;
      const p = (startTop - rect.top) / startTop;
      setEntryP(Math.max(0, Math.min(1, p)));

      if (grid) {
        const stickyTopPx = STICKY_TOP_REM * 16;
        const gridBottom = grid.getBoundingClientRect().bottom;
        setTitleOffset(Math.max(0, stickyTopPx - gridBottom));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <section
      ref={sectionRef}
      className="glass-section"
      style={{
        padding: "6rem 0",
        // Pulled up to overlap the hero's tail so "Our Services" rises from the
        // bottom while the projects grid is splitting/fading out in place.
        marginTop: "-119vh",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          transform: entryP < 1 ? `translate3d(0, ${(1 - entryP) * 70}vh, 0)` : undefined,
          opacity: entryP,
          willChange: entryP < 1 ? "transform, opacity" : "auto",
        }}
      >
      {/* Section header — sticky at top, but JS-offset so it releases together with the left card */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          maxWidth: 1200,
          margin: "0 auto 1.5rem auto",
          padding: "1.75rem 2rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: titleOffset > 0 ? `translateY(${-titleOffset}px)` : undefined,
          willChange: titleOffset > 0 ? "transform" : "auto",
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
        ref={gridRef}
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
        <div className="showcase-sticky" style={{ position: "sticky", top: `${STICKY_TOP_REM}rem` }}>
          <div
            className="glass-panel"
            style={{
              position: "relative",
              // Sized from the available viewport height (below the sticky
              // offset) so the panel always fits on screen, then capped so it
              // stays compact on tall displays.
              height: `calc(100vh - ${STICKY_TOP_REM + 3}rem)`,
              maxHeight: 600,
              aspectRatio: "4 / 5",
              width: "auto",
              maxWidth: "100%",
              marginInline: "auto",
              overflow: "hidden",
            }}
          >
            {items.map((item, i) => (
              <Visual key={i} item={item} active={i === activeIndex} />
            ))}
          </div>
        </div>

        {/* Right — scrollable cards (bottom buffer gives the last card dwell time) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "60vh" }}>
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

      </div>
    </section>
  );
}
