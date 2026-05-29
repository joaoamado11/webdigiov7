"use client";

import { useEffect, useRef, useState } from "react";

interface CardData {
  tag: string;
  title: string;
  description: string;
  accent: string;
}

const cards: CardData[] = [
  {
    tag: "Precision Engineering",
    title: "Unrivaled Code Integrity.",
    description:
      "Experience a new standard of development where AI doesn't just suggest — it solves. Every line of code is optimized for performance, scalability, and security from the first keystroke.",
    accent: "#7c5cfc",
  },
  {
    tag: "Collaborative Spirit",
    title: "Synchronized Innovation.",
    description:
      "Bridging the gap between design and deployment. Our platform fosters a shared environment where creative visionaries and technical architects speak the same language through real-time AI translation.",
    accent: "#3db5b0",
  },
  {
    tag: "Rapid Prototyping",
    title: "Instant Visual Realization.",
    description:
      "Turn sketches into fully functional interfaces in seconds. Our generative UI components adapt to your brand identity automatically, delivering pixel-perfect results without the manual labor.",
    accent: "#f59e4b",
  },
  {
    tag: "Actionable Insights",
    title: "Data-Driven Creativity.",
    description:
      "Make decisions based on facts, not guesswork. Our integrated analytics suite provides real-time feedback on user behavior, allowing you to iterate and improve with total confidence.",
    accent: "#4b9cf5",
  },
];

function CardVisual({ accent, index }: { accent: string; index: number }) {
  const shapes = [
    // Card 1 — vertical bars / code-like
    { pattern: [20, 45, 70] },
    // Card 2 — overlapping circles
    { pattern: [30, 60] },
    // Card 3 — angled blocks
    { pattern: [25, 50, 75] },
    // Card 4 — wave dots
    { pattern: [15, 40, 65, 90] },
  ];
  const shape = shapes[index % shapes.length];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 60% 50%, ${accent}10 0%, transparent 60%),
                     radial-gradient(ellipse at 30% 30%, ${accent}08 0%, transparent 50%)`,
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(84,66,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(84,66,55,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 60% 50%, black 15%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 60% 50%, black 15%, transparent 65%)",
        }}
      />
      {/* Accent glow orb */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}25 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Accent dots/markers */}
      {shape.pattern.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${pos}%`,
            right: `${15 + i * 8}%`,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            opacity: 0.5,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
      ))}
      {/* Thin accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 1,
          height: "60%",
          background: `linear-gradient(to bottom, ${accent}60, transparent)`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}

// Pin offset for cards and the title-release sync target.
const CARD_STICKY_TOP_REM = 15;

export default function StickyCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsStackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [titleOffset, setTitleOffset] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Title-release sync: push header up as the cards stack scrolls past its release point.
  useEffect(() => {
    const onScroll = () => {
      const stack = cardsStackRef.current;
      if (!stack) return;
      const stickyTopPx = CARD_STICKY_TOP_REM * 16;
      const bottom = stack.getBoundingClientRect().bottom;
      setTitleOffset(Math.max(0, stickyTopPx - bottom));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{ padding: "6rem 0" }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        {/* Header — sticky at top, JS-offset to release together with the last card */}
        <div
          ref={headerRef}
          className="animate-observe"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
            padding: "1.75rem 1rem 1.25rem",
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
            The Future of Work
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
            Empowering creative minds
            <br />
            with intelligent automation
          </h2>
        </div>

        {/* Cards stack */}
        <div
          ref={cardsStackRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
            position: "relative",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="glass-card animate-observe sticky-card-row"
              style={{
                position: "sticky",
                top: `${CARD_STICKY_TOP_REM}rem`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "3rem",
                padding: "2.5rem",
                minHeight: 420,
                overflow: "hidden",
                zIndex: i,
              }}
            >
              {/* Background visual */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "inherit",
                  overflow: "hidden",
                }}
              >
                <CardVisual accent={card.accent} index={i} />
              </div>

              {/* Text (left) */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: card.accent,
                  }}
                >
                  {card.tag}
                </span>
                <h3
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                    color: "#0e1410",
                    margin: 0,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "#3c4237",
                    maxWidth: "38ch",
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>

              {/* Visual (right) */}
              <div
                className="sticky-card-visual"
                style={{
                  position: "relative",
                  zIndex: 2,
                  flex: 1,
                  height: 340,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  background: `linear-gradient(160deg, ${card.accent}15 0%, ${card.accent}08 100%)`,
                  border: `1px solid ${card.accent}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Abstract composition per card */}
                <svg
                  viewBox="0 0 200 200"
                  style={{ width: "60%", height: "60%", opacity: 0.7 }}
                >
                  {i === 0 && (
                    // Code brackets
                    <>
                      <rect x="40" y="60" width="120" height="4" rx="2" fill={card.accent} opacity="0.6" />
                      <rect x="40" y="80" width="90" height="4" rx="2" fill={card.accent} opacity="0.35" />
                      <rect x="40" y="100" width="110" height="4" rx="2" fill={card.accent} opacity="0.5" />
                      <rect x="40" y="120" width="70" height="4" rx="2" fill={card.accent} opacity="0.3" />
                      <circle cx="160" cy="82" r="6" fill="none" stroke={card.accent} strokeWidth="2" opacity="0.5" />
                    </>
                  )}
                  {i === 1 && (
                    // Interlocking circles
                    <>
                      <circle cx="90" cy="100" r="45" fill="none" stroke={card.accent} strokeWidth="2" opacity="0.4" />
                      <circle cx="120" cy="90" r="35" fill="none" stroke={card.accent} strokeWidth="1.5" opacity="0.55" />
                      <circle cx="105" cy="110" r="20" fill="none" stroke={card.accent} strokeWidth="2" opacity="0.7" />
                    </>
                  )}
                  {i === 2 && (
                    // Layered rectangles
                    <>
                      <rect x="50" y="50" width="100" height="100" rx="12" fill="none" stroke={card.accent} strokeWidth="2" opacity="0.4" transform="rotate(15, 100, 100)" />
                      <rect x="60" y="60" width="80" height="80" rx="10" fill="none" stroke={card.accent} strokeWidth="2" opacity="0.55" transform="rotate(15, 100, 100)" />
                      <circle cx="100" cy="100" r="15" fill={card.accent} opacity="0.4" />
                    </>
                  )}
                  {i === 3 && (
                    // Data nodes
                    <>
                      <circle cx="60" cy="80" r="8" fill={card.accent} opacity="0.7" />
                      <circle cx="130" cy="55" r="10" fill={card.accent} opacity="0.5" />
                      <circle cx="150" cy="130" r="6" fill={card.accent} opacity="0.6" />
                      <circle cx="70" cy="145" r="9" fill={card.accent} opacity="0.45" />
                      <line x1="68" y1="88" x2="120" y2="55" stroke={card.accent} strokeWidth="1.5" opacity="0.3" />
                      <line x1="140" y1="65" x2="150" y2="130" stroke={card.accent} strokeWidth="1.5" opacity="0.25" />
                      <line x1="79" y1="145" x2="130" y2="55" stroke={card.accent} strokeWidth="1.5" opacity="0.2" />
                      <line x1="60" y1="88" x2="70" y2="145" stroke={card.accent} strokeWidth="1" opacity="0.2" />
                    </>
                  )}
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
