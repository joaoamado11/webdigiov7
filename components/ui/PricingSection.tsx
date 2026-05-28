"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Check, Sparkles, Search, FileText, Wrench, MessageCircle } from "lucide-react";
import { ButtonGlow } from "@/components/ui/ButtonGlow";

const features = [
  "Landing page otimizada · até 5 secções",
  "Design responsivo · mobile-first",
  "Formulário de contacto com validação",
  "Otimização SEO on-page · meta tags, schema",
  "Integração com Google Analytics / Meta Pixel",
  "Hospedagem incluída · 1 ano grátis",
  "Certificado SSL · HTTPS",
  "Suporte técnico · 30 dias pós-entrega",
];

const addons = [
  {
    icon: Search,
    title: "Auditoria SEO Avançada",
    desc: "Relatório completo de 40+ pontos. Análise técnica, on-page e competition gap. Inclui plano de ação priorizado.",
    accent: "#7c5cfc",
  },
  {
    icon: FileText,
    title: "Copywriting Premium",
    desc: "Textos persuasivos escritos por redator sénior. Adaptado ao tom da tua marca e otimizado para conversão.",
    accent: "#3db5b0",
  },
  {
    icon: Wrench,
    title: "Manutenção Mensal",
    desc: "Atualizações de segurança, backups diários, monitorização de uptime e 2h de alterações mensais incluídas.",
    accent: "#f59e4b",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function PriceCounter({ inView: visible }: { inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const controls = animate(0, 690, {
      duration: 1.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [visible]);

  return (
    <span className="text-6xl font-bold tracking-tight" style={{ color: "#f1f5f9" }}>
      {display}€
    </span>
  );
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  // Client-only scroll tracking for parallax
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sec = sectionRef.current;
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const start = window.innerHeight;
        const end = -rect.height;
        const p = (start - rect.top) / (start - end);
        setParallax(Math.max(0, Math.min(1, p)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Parallax offsets — applied as translateY via plain div wrappers
  const orb1TY = (parallax - 0.5) * 24;   // %
  const orb2TY = (parallax - 0.5) * 16;   // %
  const headerTY = (0.3 - parallax * 0.6) * 80;   // px
  const mainCardTY = (0.3 - parallax * 0.45) * 100;
  const addon0TY = (0.2 - parallax * 0.35) * 80;
  const addon1TY = (0.25 - parallax * 0.4) * 90;
  const addon2TY = (0.3 - parallax * 0.45) * 100;

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "7rem 1.5rem 8rem",
        marginTop: "-1px",
      }}
    >
      {/* ── Parallax decorative orbs ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          top: "10%",
          left: "50%",
          marginLeft: -350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.07) 0%, rgba(61,181,176,0.04) 40%, transparent 70%)",
          filter: "blur(60px)",
          transform: `translateY(${orb1TY}%)`,
          opacity: parallax < 0.15 || parallax > 0.85 ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          top: "45%",
          right: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,75,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
          transform: `translateY(${orb2TY}%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ── Header (parallax wrapper) ── */}
        <div
          ref={headerRef}
          style={{
            transform: `translateY(${headerTY}px)`,
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <motion.div
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.7, y: 8, filter: "blur(2px)" }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-5"
              style={{
                borderColor: "rgba(124,92,252,0.3)",
                color: "#7c5cfc",
                background: "rgba(124,92,252,0.06)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Investimento
            </span>
          </motion.div>

          <motion.h2
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.7, y: 10, filter: "blur(2px)" }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#0e1410",
              lineHeight: 1.15,
              margin: 0,
              marginBottom: "1rem",
            }}
          >
            Transparente, simples,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #7c5cfc 0%, #3db5b0 60%, #f59e4b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              sem surpresas
            </span>
          </motion.h2>

          <motion.p
            animate={headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.7, y: 8, filter: "blur(2px)" }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            style={{
              fontSize: "1.05rem",
              color: "#3c4237",
              maxWidth: "44ch",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Um valor justo pelo teu projeto digital. Sem mensalidades escondidas,
            sem renovações automáticas.
          </motion.p>
        </div>

        {/* ── Cards grid ── */}
        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          animate={cardsInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
          className="max-md:grid-cols-1"
        >
          {/* ── Main plan card (parallax wrapper) ── */}
          <div style={{ transform: `translateY(${mainCardTY}px)` }}>
            <motion.div variants={itemVariants}>
              <div
                className="glass-panel"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "2.5rem",
                  background:
                    "linear-gradient(145deg, rgba(30,30,50,0.85) 0%, rgba(14,20,16,0.92) 100%)",
                  borderColor: "rgba(124,92,252,0.25)",
                  boxShadow: "0 0 60px rgba(124,92,252,0.08)",
                }}
              >
                {/* Glow orb */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 40% at 50% -15%, rgba(124,92,252,0.15) 0%, transparent 65%)",
                  }}
                />

                {/* Pulse ring */}
                <motion.div
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: 320,
                    height: 320,
                    marginLeft: -160,
                    marginTop: -160,
                    borderRadius: "50%",
                    border: "1px solid rgba(124,92,252,0.12)",
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Badge — visible by default (SSR-safe), animates scale on enter */}
                <div className="absolute top-6 right-6">
                  <motion.span
                    animate={{ scale: cardsInView ? 1 : 0.85, opacity: cardsInView ? 1 : 0.5 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5"
                    style={{
                      background: "rgba(124,92,252,0.18)",
                      color: "#a78bfa",
                      border: "1px solid rgba(124,92,252,0.3)",
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    Mais Popular
                  </motion.span>
                </div>

                <p
                  className="text-sm font-semibold tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#a78bfa" }}
                >
                  Website Premium
                </p>

                <div className="flex items-end gap-2 mb-1">
                  <PriceCounter inView={cardsInView} />
                  <span className="text-sm mb-3" style={{ color: "#94a3b8" }}>
                    pagamento único
                  </span>
                </div>
                <p className="text-sm mb-8" style={{ color: "#64748b" }}>
                  Entrega em 7–12 dias úteis
                </p>

                <ul className="flex flex-col gap-3 mb-8">
                  {features.map((feat, i) => (
                    <motion.li
                      key={feat}
                      animate={cardsInView ? { opacity: 1, x: 0 } : { opacity: 0.7, x: -4 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: "#cbd5e1" }}
                    >
                      <motion.span
                        animate={cardsInView ? { scale: 1, rotate: 0 } : { scale: 0.85, rotate: 0 }}
                        transition={{
                          delay: 0.44 + i * 0.06,
                          type: "spring",
                          stiffness: 250,
                        }}
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(61,181,176,0.15)",
                          color: "#3db5b0",
                        }}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </motion.span>
                      {feat}
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 4 }}
                  transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
                >
                  <a
                    href="https://wa.me/351912345678?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Website%20Premium"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    <ButtonGlow>
                      <span className="inline-flex items-center gap-2" style={{ color: "inherit" }}>
                        <MessageCircle className="h-4 w-4" />
                        Falar no WhatsApp
                      </span>
                    </ButtonGlow>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Add-on cards ── */}
          <div className="flex flex-col gap-3">
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold mb-1"
              style={{ color: "#544237" }}
            >
              Serviços adicionais
            </motion.p>

            {addons.map((addon, i) => {
              const tys = [addon0TY, addon1TY, addon2TY];
              return (
                <div key={addon.title} style={{ transform: `translateY(${tys[i]}px)` }}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div
                      className="glass-card"
                      style={{
                        padding: "1.5rem",
                        cursor: "default",
                        borderColor: "rgba(84,66,55,0.08)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Accent glow on hover */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse 60% 50% at 100% 50%, ${addon.accent}10 0%, transparent 70%)`,
                          opacity: 0,
                          transition: "opacity 0.5s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                      />

                      <div className="flex items-start gap-4 relative z-10">
                        <motion.div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${addon.accent}14`,
                            color: addon.accent,
                          }}
                          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <addon.icon className="h-5 w-5" />
                        </motion.div>
                        <div>
                          <h4
                            className="font-semibold text-sm mb-1"
                            style={{ color: "#0e1410" }}
                          >
                            {addon.title}
                          </h4>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "#3c4237", maxWidth: "32ch" }}
                          >
                            {addon.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}

            <motion.p
              variants={itemVariants}
              className="text-xs text-center mt-3"
              style={{ color: "#544237" }}
            >
              Satisfação garantida · não gostaste?{" "}
              <span style={{ fontWeight: 600, color: "#0e1410" }}>devolvemos o teu dinheiro</span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
