"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, HelpCircle } from "lucide-react";

const faqItems = [
  {
    q: "Quanto tempo demora a desenvolver um website?",
    a: "Um site institucional (landing page até 5 secções) demora entre 7 a 12 dias úteis. Projetos mais complexos com funcionalidades personalizadas podem levar 3 a 6 semanas. Damos sempre um cronograma detalhado antes de começar.",
  },
  {
    q: "Preciso de ter o conteúdo pronto antes de começar?",
    a: "Não necessariamente. Trabalhamos com o que tiveres — mesmo que sejam apenas ideias soltas. Se precisares, temos serviço de copywriting incluído no processo. O importante é começar.",
  },
  {
    q: "O site vai aparecer no Google?",
    a: "Sim. Todos os nossos projetos incluem SEO on-page completo: meta tags otimizadas, schema markup, sitemap.xml, robots.txt, e estrutura semântica de headings. Para SEO mais avançado, oferecemos uma auditoria completa como serviço adicional.",
  },
  {
    q: "Posso atualizar o conteúdo sozinho depois?",
    a: "Claro. Para sites estáticos, entregamos o código-fonte completo com documentação. Se preferires uma solução mais amigável, podemos integrar um CMS headless (Sanity, Strapi) para que possas editar textos, imagens e páginas sem tocar em código.",
  },
  {
    q: "Quanto custa um website profissional?",
    a: "O nosso pacote Website Premium custa 690€ (pagamento único) e inclui landing page, design responsivo, SEO on-page, formulário de contacto, SSL, e 1 ano de hospedagem. Para projetos maiores, fazemos um orçamento personalizado.",
  },
  {
    q: "E se eu não gostar do resultado?",
    a: "Tens garantia de satisfação. Se o resultado final não corresponder ao briefing acordado, fazemos as revisões necessárias sem custo adicional. Se mesmo assim não estiveres satisfeito, devolvemos o teu dinheiro — sem perguntas.",
  },
  {
    q: "Fazem manutenção depois do site estar no ar?",
    a: "Sim. Oferecemos um plano de manutenção mensal que inclui atualizações de segurança, backups diários, monitorização de uptime, e 2 horas de alterações mensais. Podes contratar este serviço em qualquer altura.",
  },
  {
    q: "Trabalham com WordPress ou outras plataformas?",
    a: "Somos especialistas em Next.js e React — tecnologia moderna e performante. Não trabalhamos com WordPress. Se estás a migrar de WordPress para uma stack moderna, podemos ajudar na transição.",
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(84,66,55,0.08)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "0.938rem",
          fontWeight: 500,
          color: "#0e1410",
          textAlign: "left",
          lineHeight: 1.5,
        }}
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{
            display: "flex",
            flexShrink: 0,
            marginTop: 2,
            color: open ? "#7c5cfc" : "rgba(84,66,55,0.35)",
          }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                margin: 0,
                paddingBottom: "1.25rem",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "#3c4237",
                maxWidth: "60ch",
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqModal({
  open,
  onClose,
  origin,
}: {
  open: boolean;
  onClose: () => void;
  origin: { x: number; y: number } | null;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const openedRef = useRef(false);

  // Distance from viewport center to the button — used to slide the panel
  // from the button position into the center during the entrance animation.
  const cx = (origin?.x ?? window.innerWidth / 2) - window.innerWidth / 2;
  const cy = (origin?.y ?? window.innerHeight / 2) - window.innerHeight / 2;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Guard: only allow close after entrance animation completes
      const id = setTimeout(() => { openedRef.current = true; }, 400);
      return () => clearTimeout(id);
    } else {
      document.body.style.overflow = "";
      openedRef.current = false;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => { if (openedRef.current) onClose(); }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(14,20,16,0.45)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* Panel — slides from button to center while scaling & fading in */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.3, x: cx, y: cy }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, x: cx, y: cy }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
              mass: 0.7,
            }}
            style={{
              position: "relative",
              zIndex: 50,
              width: "min(720px, calc(100vw - 32px))",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#fff",
              boxShadow:
                "0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.02), 0 12px 40px rgba(0,0,0,0.14)",
              willChange: "transform",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#544237",
                transition: "transform 0.2s ease, color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "scale(1.2)";
                t.style.color = "#0e1410";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget as HTMLElement;
                t.style.transform = "scale(1)";
                t.style.color = "#544237";
              }}
            >
              <X size={16} strokeWidth={2} />
            </button>

            {/* Content scroll area */}
            <div style={{ flex: "1 1 auto", overflow: "auto", padding: "2rem 2rem 0" }}>
              {/* Header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-4"
                  style={{
                    borderColor: "rgba(124,92,252,0.3)",
                    background: "rgba(124,92,252,0.06)",
                  }}
                >
                  <HelpCircle className="h-3.5 w-3.5" style={{ color: "#7c5cfc" }} />
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "#7c5cfc" }}
                  >
                    FAQ
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "#0e1410",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Perguntas
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #7c5cfc 0%, #3db5b0 60%, #f59e4b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    frequentes
                  </span>
                </h2>
              </div>

              {/* FAQ items */}
              <div>
                {faqItems.map((item, i) => (
                  <FaqItem
                    key={i}
                    q={item.q}
                    a={item.a}
                    open={activeIndex === i}
                    onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                padding: "1rem 2rem",
                background: "#f5f2ec",
                borderTop: "1px solid rgba(84,66,55,0.06)",
                flexShrink: 0,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: 8,
                  border: "1px solid rgba(84,66,55,0.12)",
                  background: "transparent",
                  color: "#544237",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(84,66,55,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                Fechar
              </button>
              <a
                href="https://wa.me/351912345678"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: 8,
                  background: "#7c5cfc",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  transition: "filter 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "brightness(0.95)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.filter = "none";
                }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
