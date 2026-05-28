"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

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

const N = cards.length;
const CARD_WIDTH = 260;
const CARD_HEIGHT = 340;
const GAP = 50;

// Cylindrical radius — derived from circumference (so cards don't overlap or leave gaps).
const RADIUS = Math.round((N * (CARD_WIDTH + GAP)) / (2 * Math.PI));
const STEP = 360 / N;

const ENTRY_END = 0.25;
const OUTRO_START = 0.75;

const PER_CARD_DUR = 0.18;
const STAGGER = (ENTRY_END - PER_CARD_DUR) / (N - 1);

const BASE_SPIN = 5;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

function computeCardTransform(
  i: number,
  progress: number,
  spinDeg: number,
): { transform: string; opacity: number } {
  let cardP: number;

  if (progress < ENTRY_END) {
    const start = i * STAGGER;
    cardP = clamp((progress - start) / PER_CARD_DUR, 0, 1);
  } else if (progress > OUTRO_START) {
    const outroDelta = progress - OUTRO_START;
    const reverseI = N - 1 - i;
    const exitStart = reverseI * STAGGER;
    const cardExitP = clamp((outroDelta - exitStart) / PER_CARD_DUR, 0, 1);
    cardP = 1 - cardExitP;
  } else {
    cardP = 1;
  }

  const eased = easeOutCubic(cardP);

  const ringAngle = STEP * i + spinDeg;

  // Off-right line position (entry start) — cards staggered horizontally + slightly higher.
  const startX = 900 + i * 110;
  const startY = -220;

  const x = lerp(startX, 0, eased);
  const y = lerp(startY, 0, eased);
  const angle = lerp(0, ringAngle, eased);
  const radius = RADIUS * eased;

  // Spiral spin during transit — peaks mid-transit, zero at endpoints.
  const spiralBonus = 540 * Math.sin(cardP * Math.PI);
  const totalAngle = angle + spiralBonus;

  const opacity = clamp(cardP * 1.8, 0, 1);

  const transform = `translate3d(${x}px, ${y}px, 0px) rotateY(${totalAngle}deg) translateZ(${radius}px)`;
  return { transform, opacity };
}

type CardData = (typeof cards)[number];

function CardFace({ card, index, back }: { card: CardData; index: number; back?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: back ? "rotateY(180deg)" : undefined,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        background: "rgba(255,255,255,0.96)",
        borderRadius: 18,
        padding: "1.5rem",
        boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,255,255,0.5)",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
      }}
    >
      <div style={{
        width: "100%",
        height: 150,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${card.accent}38 0%, ${card.accent}12 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 64,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${card.accent}40 0%, transparent 60%)`,
        }} />
        <span style={{ position: "relative", zIndex: 1 }}>{card.icon}</span>
      </div>

      <div style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: card.accent,
        fontWeight: 600,
      }}>
        Service · 0{index + 1}
      </div>

      <h3 style={{
        fontSize: "1.15rem",
        fontWeight: 600,
        color: "#0e1410",
        lineHeight: 1.2,
        margin: 0,
        letterSpacing: "-0.01em",
      }}>
        {card.title}
      </h3>

      <p style={{
        fontSize: "0.78rem",
        color: "#6b6b6b",
        lineHeight: 1.45,
        margin: 0,
        flex: 1,
      }}>
        {card.subtitle}
      </p>

      <div style={{
        width: 32,
        height: 3,
        borderRadius: 2,
        background: card.accent,
        marginTop: "auto",
      }} />
    </div>
  );
}

export default function OrbitCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const isHoveringRef = useRef(false);

  const spinDegRef = useRef(0);
  const spinSpeedRef = useRef(BASE_SPIN);
  const targetSpeedRef = useRef(BASE_SPIN);

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = total <= 0 ? 1 : clamp(-rect.top / total, 0, 1);
      progressRef.current = p;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const p = progressRef.current;
    if (p < ENTRY_END || p > OUTRO_START) return;
    const dir = e.deltaY >= 0 ? 1 : -1;
    const mag = Math.min(80, Math.abs(e.deltaY) * 0.5);
    targetSpeedRef.current = BASE_SPIN + dir * mag;
  }, []);

  useLayoutEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const { transform, opacity } = computeCardTransform(i, 0, 0);
      el.style.transform = transform;
      el.style.opacity = String(opacity);
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      const p = progressRef.current;
      const isIdle = p >= ENTRY_END && p <= OUTRO_START;

      spinSpeedRef.current += (targetSpeedRef.current - spinSpeedRef.current) * Math.min(1, dt * 5);
      targetSpeedRef.current += (BASE_SPIN - targetSpeedRef.current) * Math.min(1, dt * 1.5);

      if (isIdle && !isHoveringRef.current) {
        spinDegRef.current = (spinDegRef.current + spinSpeedRef.current * dt) % 360;
      }

      const spin = spinDegRef.current;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const { transform, opacity } = computeCardTransform(i, p, spin);
        el.style.transform = transform;
        el.style.opacity = String(opacity);
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const titleOpacity = (() => {
    if (progress < ENTRY_END) return clamp((progress / ENTRY_END) * 2, 0, 1);
    if (progress > OUTRO_START) return clamp(1 - ((progress - OUTRO_START) / (1 - OUTRO_START)) * 2, 0, 1);
    return 1;
  })();

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{ position: "relative", height: "400vh" }}
      onWheel={onWheel}
    >
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        perspective: "1000px",
      }}>
        {/* Title */}
        <div style={{
          position: "absolute", top: "5rem", left: "50%", transform: "translateX(-50%)",
          zIndex: 10, textAlign: "center",
          opacity: titleOpacity, transition: "opacity 0.25s linear",
          pointerEvents: "none",
        }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7c5cfc", marginBottom: "0.75rem" }}>
            Our Expertise
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.02em", color: "#0e1410", margin: 0 }}>
            Technologies we orbit around
          </h2>
        </div>

        {/* Flat horizontal cylinder — no X-tilt, pure Y-axis rotation */}
        <div
          onMouseEnter={() => { isHoveringRef.current = true; }}
          onMouseLeave={() => { isHoveringRef.current = false; }}
          style={{
            position: "relative",
            width: 0, height: 0,
            transformStyle: "preserve-3d",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top: -CARD_HEIGHT / 2,
                left: -CARD_WIDTH / 2,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              {/* Front face */}
              <CardFace card={card} index={i} />
              {/* Back face — same content, pre-rotated 180° so whichever face is forward shows cleanly. */}
              <CardFace card={card} index={i} back />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
