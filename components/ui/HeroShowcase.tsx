"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import ButtonWithIcon from "@/components/ui/ButtonWithIcon";
import { ButtonGlow } from "@/components/ui/ButtonGlow";
import LogoCarousel from "@/components/ui/logo-carousel";
import {
  projects,
  ProjectCardVisual,
  GRID_CARD_W,
  SPLIT_DIR,
} from "@/components/ui/projectsData";

const colors = {
  ink: "#0e1410",
  subdued: "#3c4237",
  muted: "#544237",
};

// ── Stacked deck (initial) geometry — sits just right of the text, centered ──
const STACK_ANCHOR = { x: 0.72, y: 0.5 };
const STACK_FAN = [
  { x: -18, y: -14, rot: -6 },
  { x: -6, y: -5, rot: -2 },
  { x: 6, y: 4, rot: 3 },
  { x: 18, y: 13, rot: 7 },
];
// Deck is large (close to the final grid size) but still a touch smaller so
// the cards grow a little as they travel into place during the scroll.
const STACK_SCALE = 0.85;
// Minimal constant gap between grid cards (px). Cards shrink to keep this gap
// at any window size, so they never touch — but never overlap either.
const GRID_GAP = 16;
// Fixed (non-scaling) chrome bar + caption height inside a card.
const CARD_CHROME = 88;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
// easeInOutCubic — premium, symmetric acceleration/deceleration.
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// easeOutBack — decelerates past the target then settles, for a "falling" drop.
const easeOutBack = (t: number) => {
  const c1 = 1.18;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// One sticky stage drives the full sequence:
//   text reveal → hold → deck unfolds into a 2×2 grid → grid splits diagonally
// while "Our Services" (ScrollShowcase) rises from the bottom to replace it.
const REVEAL_SCROLL_VH = 4.5;

export default function HeroShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [stage, setStage] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) { setP(1); return; }
      setP(clamp(-rect.top / total));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      if (stageRef.current) {
        const r = stageRef.current.getBoundingClientRect();
        setStage({ w: r.width, h: r.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const phaseOpacity = (start: number, end: number) =>
    clamp((p - start) / (end - start || 1));

  // ── Hero text reveal (front-loaded) ──
  const badgeOp = phaseOpacity(0.0, 0.035);
  const headlineOp = phaseOpacity(0.02, 0.06);
  const descOp = phaseOpacity(0.04, 0.085);
  const pillsOp = phaseOpacity(0.065, 0.105);
  const buttonsOp = phaseOpacity(0.09, 0.13);
  const statsOp = phaseOpacity(0.115, 0.165);

  // Cards snap in (solid) as a stacked deck on the right.
  const cardsOp = phaseOpacity(0.06, 0.12);

  // Deck → grid.
  const tt = ease(clamp((p - 0.34) / 0.18));
  // Long dwell on the formed grid, then a slow diagonal split (starts at 0.80)
  // so the grid stays pinned much longer before "Our Services" takes over.
  const sp = ease(clamp((p - 0.8) / 0.18));
  const splitFade = clamp((p - 0.86) / 0.12);

  // Hero text clears as the unfold begins — fades upward (out the top).
  const textFade = 1 - phaseOpacity(0.34, 0.44);
  const textY = -phaseOpacity(0.34, 0.44) * 120;

  // "Selected Work" + "Latest Projects" move as ONE locked block: they fall in
  // together (sooner) and lift + fade away together on the split — the reverse
  // of the outro, with fixed relative spacing.
  const headIn = clamp((p - 0.44) / 0.12);
  const headOut = clamp((p - 0.8) / 0.12);
  const headY = (easeOutBack(headIn) - 1) * 220 - headOut * 60;
  const headOpacity = headIn * (1 - headOut);

  const captionsShown = tt > 0.7 && sp < 0.2;

  // ── Dynamic 2×2 grid geometry (gap-driven) ──
  // Card width is the smaller of a window-relative width and the largest size
  // that lets two rows + the gap fit the available height. The gap is a fixed
  // constant, so the cards never touch and never overlap at any window size.
  const headingSpace = Math.max(140, stage.h * 0.17);
  const bottomMargin = stage.h * 0.04;
  const usableH = Math.max(160, stage.h - headingSpace - bottomMargin);
  const cardWByWidth = GRID_CARD_W * stage.w;
  const cardWByHeight = Math.max(40, ((usableH - GRID_GAP) / 2 - CARD_CHROME) / 0.5625);
  const cardW = Math.min(cardWByWidth, cardWByHeight);
  const cardH = cardW * 0.5625 + CARD_CHROME;
  const gridBlockH = 2 * cardH + GRID_GAP;
  const gridTop = headingSpace + (usableH - gridBlockH) / 2;
  const cyTop = gridTop + cardH / 2;
  const cyBot = gridTop + cardH + GRID_GAP + cardH / 2;
  const cxLeft = stage.w / 2 - (cardW + GRID_GAP) / 2;
  const cxRight = stage.w / 2 + (cardW + GRID_GAP) / 2;
  const gridCenters = [
    { x: cxLeft, y: cyTop },
    { x: cxRight, y: cyTop },
    { x: cxLeft, y: cyBot },
    { x: cxRight, y: cyBot },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero-showcase"
      className="glass-section"
      style={{
        position: "relative",
        width: "100%",
        height: `${REVEAL_SCROLL_VH * 100}vh`,
        marginTop: "-60vh",
      }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
        <div
          ref={stageRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(1280px, calc(100% - 3rem))",
          }}
        >
          {/* ── Grid-phase heading — eyebrow + title locked as one block ── */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              left: 0,
              right: 0,
              textAlign: "center",
              pointerEvents: "none",
              opacity: headOpacity,
              transform: `translateY(${headY}px)`,
              willChange: "opacity, transform",
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#7c5cfc",
                marginBottom: "0.85rem",
              }}
            >
              Selected Work
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: colors.ink,
                margin: 0,
              }}
            >
              Latest Projects
            </h2>
          </div>

          {/* ── Hero idle content — two columns; the left stats box and the
              right "Tech Stack" carousel are both pinned to the bottom so they
              align horizontally. Fades up as the unfold starts. ── */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              transform: `translateY(calc(-50% + ${textY}px))`,
              opacity: textFade,
              pointerEvents: textFade < 0.05 ? "none" : "auto",
              willChange: "opacity, transform",
            }}
          >
            <div style={{ display: "flex", alignItems: "stretch", gap: "3rem", padding: "0 5%" }}>
              {/* Left column — text, with the stats box pinned to the bottom */}
              <div style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2rem" }}>
                <div>
                  <div style={{ opacity: badgeOp, transform: `translateY(${(1 - badgeOp) * 16}px)` }}>
                    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                      style={{ borderColor: "rgba(84,66,55,0.15)", color: colors.muted }}>
                      <Sparkles className="h-3.5 w-3.5" style={{ color: "#7c5cfc" }} />
                      Digital Agency Premium
                    </div>
                  </div>

                  <div style={{ opacity: headlineOp, transform: `translateY(${(1 - headlineOp) * 20}px)` }}>
                    <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em", color: colors.ink, margin: 0, marginBottom: "1.5rem" }}>
                      We build digital<br />
                      <span style={{ background: "linear-gradient(135deg, #7c5cfc 0%, #3db5b0 50%, #f59e4b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        products that perform
                      </span>
                    </h1>
                  </div>

                  <div style={{ opacity: descOp, transform: `translateY(${(1 - descOp) * 20}px)` }}>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.65, color: colors.subdued, maxWidth: "46ch", margin: 0, marginBottom: "2rem" }}>
                      From strategy to deployment, we craft high-performance websites, mobile apps, and AI-powered tools that drive growth for ambitious brands.
                    </p>
                  </div>

                  <div style={{ opacity: pillsOp, transform: `translateY(${(1 - pillsOp) * 16}px)` }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                      {["Next.js & React", "AI-powered", "Performance-first"].map((pill) => (
                        <span key={pill} className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em]"
                          style={{ borderColor: "rgba(84,66,55,0.12)", color: colors.muted }}>{pill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ opacity: buttonsOp, transform: `translateY(${(1 - buttonsOp) * 16}px)` }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      <ButtonGlow>
                        <ButtonWithIcon>Start a project</ButtonWithIcon>
                      </ButtonGlow>
                      <Button size="lg" variant="outline" className="!rounded-full px-7 text-base"
                        style={{ borderColor: "rgba(84,66,55,0.15)", color: colors.subdued, background: "rgba(255,255,255,0.3)" }}>
                        Our work
                      </Button>
                    </div>
                  </div>
                </div>

                <div style={{ opacity: statsOp, transform: `translateY(${(1 - statsOp) * 16}px)` }}>
                  <div className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(84,66,55,0.08)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                    {[{ label: "Projects delivered", value: "320+" }, { label: "Avg. response", value: "<24h" }, { label: "Client retention", value: "98%" }].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: colors.muted, marginBottom: "0.25rem" }}>{s.label}</div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 600, color: colors.ink }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — the deck floats above (rendered separately);
                  "Tech Stack" carousel pinned to the bottom, aligned with stats */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "stretch" }}>
                <div
                  className="rounded-2xl p-5"
                  style={{
                    opacity: statsOp,
                    transform: `translateY(${(1 - statsOp) * 16}px)`,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(84,66,55,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: colors.muted }}>
                    Tech Stack
                  </div>
                  <LogoCarousel columnCount={3} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Cards: deck → grid → diagonal split ── */}
          {projects.map((proj, i) => {
            const g = gridCenters[i];
            const deckBaseX = STACK_ANCHOR.x * stage.w - g.x + STACK_FAN[i].x;
            const deckBaseY = STACK_ANCHOR.y * stage.h - g.y + STACK_FAN[i].y;
            const tx = (1 - tt) * deckBaseX + SPLIT_DIR[i].x * sp * stage.w * 0.95;
            const ty = (1 - tt) * deckBaseY + SPLIT_DIR[i].y * sp * stage.h * 0.6;
            const rot = (1 - tt) * STACK_FAN[i].rot + SPLIT_DIR[i].x * sp * 10;
            // Cards grow from the small deck size up to full size as they travel.
            const scale = STACK_SCALE + (1 - STACK_SCALE) * tt - sp * 0.08;

            return (
              <div
                key={proj.title}
                style={{
                  position: "absolute",
                  left: g.x,
                  top: g.y,
                  width: cardW,
                  opacity: cardsOp * (1 - splitFade),
                  transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`,
                  zIndex: 10 + i,
                  willChange: "transform, opacity",
                }}
              >
                <ProjectCardVisual project={proj} showCaption={captionsShown} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
