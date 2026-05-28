"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import ButtonWithIcon from "@/components/ui/ButtonWithIcon";
import { ButtonGlow } from "@/components/ui/ButtonGlow";

// ── Service data ──

const keyServices = [
  { id: 1, name: "Web Development", subtitle: "Next.js · React · Tailwind · Performance-first", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" },
  { id: 2, name: "Mobile Apps", subtitle: "iOS · Android · Cross-platform · React Native", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop" },
  { id: 3, name: "AI Integration", subtitle: "Chatbots · Automation · LLMs · RAG pipelines", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop" },
  { id: 4, name: "Cloud Infrastructure", subtitle: "AWS · DevOps · Docker · Auto-scaling", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2344&auto=format&fit=crop" },
  { id: 5, name: "UX & Brand Design", subtitle: "Figma · Design systems · Identity · Prototypes", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2328&auto=format&fit=crop" },
];

const backgroundServices = [
  { id: 6, name: "SEO Optimization", subtitle: "Rankings · Traffic", image: "https://images.unsplash.com/photo-1432888622747-f7875291b4a9?q=80&w=2340&auto=format&fit=crop" },
  { id: 7, name: "E-commerce", subtitle: "Shopify · Stripe", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop" },
  { id: 8, name: "API Development", subtitle: "REST · GraphQL", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2334&auto=format&fit=crop" },
  { id: 9, name: "DevOps & CI/CD", subtitle: "Docker · GitHub Actions", image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2532&auto=format&fit=crop" },
  { id: 10, name: "Data Analytics", subtitle: "Dashboards · Reports", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop" },
  { id: 11, name: "Performance Tuning", subtitle: "Lighthouse · Core Web Vitals", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2340&auto=format&fit=crop" },
  { id: 12, name: "Technical Consulting", subtitle: "Architecture · Audits", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2340&auto=format&fit=crop" },
  { id: 13, name: "Migration Services", subtitle: "Legacy → Modern Stack", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop" },
  { id: 14, name: "Maintenance & Support", subtitle: "24/7 · SLA-backed", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2340&auto=format&fit=crop" },
  { id: 15, name: "Headless CMS", subtitle: "Strapi · Sanity · Contentful", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2340&auto=format&fit=crop" },
];

const colors = {
  ink: "#0e1410",
  subdued: "#3c4237",
  muted: "#544237",
};

// ── Helpers ──

function getRandomEdgePoint(containerSize: { width: number; height: number }, edge: "top" | "bottom" | "left" | "right") {
  const margin = 100;
  switch (edge) {
    case "top": return { x: Math.random() * containerSize.width, y: -margin };
    case "bottom": return { x: Math.random() * containerSize.width, y: containerSize.height + margin };
    case "left": return { x: -margin, y: Math.random() * containerSize.height };
    case "right": return { x: containerSize.width + margin, y: Math.random() * containerSize.height };
  }
}

// ── Animated Product ──

interface ServiceMeta {
  name: string;
  subtitle: string;
}

function AnimatedProduct({ service, isKey, containerSize, paused, onReachCenter, onComplete, large }: {
  service: (typeof keyServices)[0];
  isKey?: boolean;
  containerSize: { width: number; height: number };
  paused?: boolean;
  onReachCenter?: (meta: ServiceMeta) => void;
  onComplete?: () => void;
  large?: boolean;
}) {
  const controls = useAnimation();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (paused) {
      controls.stop();
      return;
    }

    const animate = async () => {
      if (!mountedRef.current) return;
      if (isKey) {
        const edges: Array<"top" | "bottom" | "left" | "right"> = ["top", "bottom", "left", "right"];
        const entryEdge = edges[Math.floor(Math.random() * edges.length)];
        const start = getRandomEdgePoint(containerSize, entryEdge);
        const center = { x: containerSize.width / 2 - 40, y: containerSize.height / 2 - 60 };

        await controls.set({ x: start.x, y: start.y, scale: 0.7, filter: "blur(4px)", opacity: 0.8 });
        await controls.start({
          x: center.x, y: center.y, scale: 1.8, filter: "blur(0px)", opacity: 1,
          transition: { duration: 3, ease: "easeInOut" },
        });

        onReachCenter?.({ name: service.name, subtitle: service.subtitle });
        await new Promise((r) => setTimeout(r, 3000));

        const exitEdges: Array<"top" | "bottom" | "left" | "right"> = ["top", "bottom", "left", "right"];
        const exit = getRandomEdgePoint(containerSize, exitEdges[Math.floor(Math.random() * exitEdges.length)]);
        await controls.start({
          x: exit.x, y: exit.y, scale: 0.7, filter: "blur(4px)", opacity: 0.5,
          transition: { duration: 2.5, ease: "easeInOut" },
        });
      } else {
        const loop = async () => {
          // Start from a random edge
          const edges: Array<"top" | "bottom" | "left" | "right"> = ["top", "bottom", "left", "right"];
          let from = getRandomEdgePoint(containerSize, edges[Math.floor(Math.random() * edges.length)]);
          await controls.set({ x: from.x, y: from.y, scale: 0.5, filter: "blur(2px)", opacity: 0.6 });

          while (true) {
            // Pick a destination — not the same edge direction to avoid straight lines
            const to = getRandomEdgePoint(containerSize, edges[Math.floor(Math.random() * edges.length)]);
            // Use easeInOut for boomerang-like deceleration/acceleration
            await controls.start({
              x: to.x, y: to.y,
              transition: { duration: 5 + Math.random() * 4, ease: "easeInOut" },
            });
            from = to;
          }
        };
        loop();
      }

      if (isKey) onComplete?.();
    };
    animate();
  }, [isKey, containerSize, paused]);

  return (
    <motion.div className={large ? "absolute w-40 h-40 md:w-52 md:h-52" : "absolute w-16 h-16 md:w-20 md:h-20"} animate={controls} style={{ willChange: "transform, opacity, filter" }}>
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-lg">
        <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </motion.div>
  );
}

// ── Metadata ──

const MetadataDisplay = memo(function MetadataDisplay({ metadata }: { metadata: ServiceMeta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-20"
      style={{ paddingBottom: "2rem" }}
    >
      <div className="glass-panel" style={{
        padding: "1.25rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem",
        background: "rgba(255,255,255,0.6)", backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #7c5cfc, #3db5b0)", boxShadow: "0 0 16px rgba(124,92,252,0.3)" }} />
          <div style={{ width: 1, height: 32, background: "rgba(84,66,55,0.12)" }} />
        </div>
        <div>
          <p style={{ color: colors.ink, fontWeight: 600, fontSize: "1.1rem", margin: 0 }}>{metadata.name}</p>
          <p style={{ color: colors.subdued, fontSize: "0.8rem", margin: 0, marginTop: 2 }}>{metadata.subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
});

// ── Hero Showcase ──

const REVEAL_SCROLL_VH = 2.8; // 280vh — reveal + extended idle + outro phases

export default function HeroShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const [currentMeta, setCurrentMeta] = useState<ServiceMeta | null>(null);
  const [keyIndex, setKeyIndex] = useState(0);
  const [keyAnimating, setKeyAnimating] = useState(true);
  const [bgInstances] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: `bg-${i}`,
      service: backgroundServices[i % backgroundServices.length],
    }))
  );

  // Compute reveal progress (0→1) based on scroll position within this section.
  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) { setRevealProgress(1); return; }
      const p = -rect.top / total;
      setRevealProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track container size for the floating cards.
  useEffect(() => {
    let t: NodeJS.Timeout | null = null;
    const update = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        if (containerRef.current) {
          const r = containerRef.current.getBoundingClientRect();
          setContainerSize({ width: r.width, height: r.height });
        }
      }, 100);
    };
    update();
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); if (t) clearTimeout(t); };
  }, []);

  const handleComplete = useCallback(() => {
    setKeyAnimating(false);
    setTimeout(() => { setKeyIndex((p) => (p + 1) % keyServices.length); setKeyAnimating(true); }, 100);
  }, []);

  const handleCenter = useCallback((meta: ServiceMeta) => {
    setCurrentMeta(meta);
    setTimeout(() => setCurrentMeta(null), 3000);
  }, []);

  // Reveal phases — front-loaded: everything revealed by 0.40.
  const phaseOpacity = (start: number, end: number) => {
    const range = end - start;
    if (range <= 0) return 0;
    return Math.max(0, Math.min(1, (revealProgress - start) / range));
  };

  const badgeOp = phaseOpacity(0.0, 0.06);
  const headlineOp = phaseOpacity(0.03, 0.1);
  const descOp = phaseOpacity(0.07, 0.16);
  const pillsOp = phaseOpacity(0.1, 0.18);
  const buttonsOp = phaseOpacity(0.14, 0.24);
  const statsOp = phaseOpacity(0.2, 0.3);
  const rightPanelOp = phaseOpacity(0.26, 0.4);
  const bgCardsActive = revealProgress >= 0.3;
  const keyCardsActive = revealProgress >= 0.42;

  // Outro split-fade phase (progress 0.93 → 1.0) — left slides left, right slides right, both fade.
  // Extended idle before outro so the hero stays on screen much longer.
  const outroP = phaseOpacity(0.93, 1.0);
  const outroFade = 1 - outroP;
  const leftOutroX = outroP * -220;
  const rightOutroX = outroP * 220;

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{
        position: "relative",
        width: "100%",
        height: `${REVEAL_SCROLL_VH * 100}vh`,
        marginTop: "-60vh",
      }}
    >
      {/* Sticky inner — stays fixed in viewport during the reveal */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>
          <div className="hero-showcase-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* ── Left: progressively revealed text (outros left) ── */}
            <div style={{
              opacity: outroFade,
              transform: `translateX(${leftOutroX}px)`,
              willChange: "transform, opacity",
            }}>
              {/* Badge */}
              <div style={{ opacity: badgeOp, transform: `translateY(${(1 - badgeOp) * 16}px)`, transition: "opacity 0.25s linear, transform 0.25s linear" }}>
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6"
                  style={{ borderColor: "rgba(84,66,55,0.15)", color: colors.muted }}>
                  <Sparkles className="h-3.5 w-3.5" style={{ color: "#7c5cfc" }} />
                  Digital Agency Premium
                </div>
              </div>

              {/* Headline */}
              <div style={{ opacity: headlineOp, transform: `translateY(${(1 - headlineOp) * 20}px)`, transition: "opacity 0.3s linear, transform 0.3s linear" }}>
                <h1 style={{
                  fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 600, lineHeight: 1.08,
                  letterSpacing: "-0.02em", color: colors.ink, margin: 0, marginBottom: "1.5rem",
                }}>
                  We build digital<br />
                  <span style={{ background: "linear-gradient(135deg, #7c5cfc 0%, #3db5b0 50%, #f59e4b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    products that perform
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div style={{ opacity: descOp, transform: `translateY(${(1 - descOp) * 20}px)`, transition: "opacity 0.3s linear, transform 0.3s linear" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.65, color: colors.subdued, maxWidth: "46ch", margin: 0, marginBottom: "2rem" }}>
                  From strategy to deployment, we craft high-performance websites, mobile apps, and AI-powered tools that drive growth for ambitious brands.
                </p>
              </div>

              {/* Pills */}
              <div style={{ opacity: pillsOp, transform: `translateY(${(1 - pillsOp) * 16}px)`, transition: "opacity 0.3s linear, transform 0.3s linear" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
                  {["Next.js & React", "AI-powered", "Performance-first"].map((p) => (
                    <span key={p} className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em]"
                      style={{ borderColor: "rgba(84,66,55,0.12)", color: colors.muted }}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ opacity: buttonsOp, transform: `translateY(${(1 - buttonsOp) * 16}px)`, transition: "opacity 0.3s linear, transform 0.3s linear" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
                  <ButtonGlow>
                    <ButtonWithIcon>
                      Start a project
                    </ButtonWithIcon>
                  </ButtonGlow>
                  <Button size="lg" variant="outline" className="!rounded-full px-7 text-base"
                    style={{ borderColor: "rgba(84,66,55,0.15)", color: colors.subdued, background: "rgba(255,255,255,0.3)" }}>
                    Our work
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ opacity: statsOp, transform: `translateY(${(1 - statsOp) * 16}px)`, transition: "opacity 0.3s linear, transform 0.3s linear" }}>
                <div className="rounded-2xl p-5"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(84,66,55,0.08)",
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  {[{ label: "Projects delivered", value: "320+" }, { label: "Avg. response", value: "<24h" }, { label: "Client retention", value: "98%" }].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: colors.muted, marginBottom: "0.25rem" }}>{s.label}</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 600, color: colors.ink }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: reveals later in the scroll (outros right) ── */}
            <div style={{
              opacity: rightPanelOp * outroFade,
              transform: `translateX(${(1 - rightPanelOp) * 30 + rightOutroX}px)`,
              transition: "opacity 0.4s linear, transform 0.4s linear",
              willChange: "transform, opacity",
            }}>
              <div
                ref={containerRef}
                className="hero-showcase-spotlight"
                style={{
                  position: "relative",
                  width: "100%",
                  height: 500,
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  border: "1px solid rgba(84,66,55,0.1)",
                  background: "radial-gradient(circle at 30% 20%, rgba(124,92,252,0.06), transparent 60%), radial-gradient(circle at 70% 80%, rgba(61,181,176,0.06), transparent 60%), rgba(255,255,255,0.1)",
                }}
              >
                {bgCardsActive && bgInstances.map((item) => (
                  <AnimatedProduct key={item.id} service={item.service} containerSize={containerSize} large />
                ))}
                {keyCardsActive && keyAnimating && (
                  <AnimatedProduct
                    key={`key-${keyServices[keyIndex].id}-${keyIndex}`}
                    service={keyServices[keyIndex]}
                    isKey
                    containerSize={containerSize}
                    onReachCenter={handleCenter}
                    onComplete={handleComplete}
                  />
                )}
                <AnimatePresence mode="wait">
                  {currentMeta && <MetadataDisplay metadata={currentMeta} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
