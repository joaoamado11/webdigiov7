"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Menu, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonWithIcon from "@/components/ui/ButtonWithIcon";
import FaqModal from "@/components/ui/FaqModal";

interface NavLink {
  title: string;
  href: string;
}

interface ColumnBlock {
  heading: string;
  links: NavLink[];
}

interface PromoCard {
  title: string;
  description: string;
  image: string;
  cta: string;
  href: string;
}

interface DropdownData {
  columns: ColumnBlock[];
  promo?: PromoCard;
}

// ── Dropdown content per nav item ──

const dropdowns: Record<string, DropdownData> = {
  Services: {
    columns: [
      {
        heading: "Development",
        links: [
          { title: "Web apps", href: "#" },
          { title: "Mobile apps", href: "#" },
          { title: "E-commerce", href: "#" },
          { title: "Landing pages", href: "#" },
          { title: "Headless CMS", href: "#" },
        ],
      },
      {
        heading: "AI & Data",
        links: [
          { title: "AI Integration", href: "#" },
          { title: "Chatbots", href: "#" },
          { title: "Automation", href: "#" },
          { title: "Analytics", href: "#" },
          { title: "RAG pipelines", href: "#" },
        ],
      },
      {
        heading: "Infrastructure",
        links: [
          { title: "Cloud & DevOps", href: "#" },
          { title: "CI/CD pipelines", href: "#" },
          { title: "API Development", href: "#" },
          { title: "Performance tuning", href: "#" },
          { title: "Migration services", href: "#" },
        ],
      },
    ],
    promo: {
      title: "Full-stack development",
      description:
        "End-to-end web and mobile solutions built with Next.js, React, and cloud-native architecture.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      cta: "View work",
      href: "#",
    },
  },
  Company: {
    columns: [
      {
        heading: "About",
        links: [
          { title: "Our story", href: "#" },
          { title: "Team", href: "#" },
          { title: "Careers", href: "#" },
          { title: "Press", href: "#" },
        ],
      },
      {
        heading: "Work",
        links: [
          { title: "Portfolio", href: "#" },
          { title: "Case studies", href: "#" },
          { title: "Testimonials", href: "#" },
          { title: "Clients", href: "#" },
        ],
      },
    ],
    promo: {
      title: "Our portfolio",
      description:
        "Explore how we've helped brands transform their digital presence with cutting-edge technology.",
      image:
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2340&auto=format&fit=crop",
      cta: "Browse work",
      href: "#",
    },
  },
  Connect: {
    columns: [
      {
        heading: "Get in touch",
        links: [
          { title: "Contact us", href: "#" },
          { title: "Start a project", href: "#" },
          { title: "Request a quote", href: "#" },
          { title: "Schedule a call", href: "#" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { title: "Blog", href: "#" },
          { title: "Guides", href: "#" },
          { title: "FAQ", href: "#" },
          { title: "Documentation", href: "#" },
        ],
      },
    ],
    promo: {
      title: "Let's talk",
      description:
        "Every great project starts with a conversation. Reach out and let's build something extraordinary together.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2340&auto=format&fit=crop",
      cta: "Get in touch",
      href: "#",
    },
  },
};

// ── Shared mobile link blocks ──

interface MobileLinkBlock {
  tagline: string;
  links: { title: string; tag?: string; href: string }[];
}

const mobileLinkBlocks: MobileLinkBlock[] = [
  {
    tagline: "Services",
    links: [
      { title: "Web Development", href: "#", tag: "Next.js · React" },
      { title: "Mobile Apps", href: "#", tag: "iOS · Android" },
      { title: "AI Integration", href: "#", tag: "LLMs · Automation" },
      { title: "Cloud & DevOps", href: "#", tag: "AWS · Docker" },
    ],
  },
  {
    tagline: "Company",
    links: [
      { title: "About Us", href: "#" },
      { title: "Our Work", href: "#" },
      { title: "Careers", href: "#" },
    ],
  },
  {
    tagline: "Connect",
    links: [
      { title: "Contact", href: "#" },
      { title: "Blog", href: "#" },
    ],
  },
];

function useDropdownPosition() {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState("50%");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      const vw = window.innerWidth;
      const pad = 16;
      const idealLeft = (vw - w) / 2;
      const clamped = Math.max(pad, Math.min(idealLeft, vw - w - pad));
      setLeft(`${clamped}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref.current]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ref: ref as any, left };
}

function MegaDropdown({
  data,
  onClose,
}: {
  data: DropdownData;
  onClose: () => void;
}) {
  const { ref, left } = useDropdownPosition();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: "fixed",
        top: 40,
        left,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "rgba(0, 0, 0, 0.04) 0px 0px 8px 0px",
        zIndex: 55,
        display: "flex",
        overflow: "hidden",
        maxWidth: "calc(100vw - 2rem)",
        maxHeight: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      {/* Link columns */}
      <div
        style={{
          display: "flex",
          padding: "2rem",
          gap: "2.5rem",
        }}
      >
        {data.columns.map((col) => (
          <div key={col.heading} style={{ width: 180 }}>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0e1410",
                margin: 0,
                marginBottom: "0.75rem",
              }}
            >
              {col.heading}
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {col.links.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={onClose}
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#8a8a8a",
                    textDecoration: "none",
                    padding: "0.35rem 0",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    (e.currentTarget as HTMLElement).style.transition = "transform 0.2s ease-out";
                    (e.currentTarget as HTMLElement).style.color = "#0e1410";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    (e.currentTarget as HTMLElement).style.color = "#8a8a8a";
                  }}
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Promo card */}
      {data.promo && (
        <div
          style={{
            width: 380,
            background: "#f5f2ec",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "0.5rem",
            borderRadius: 16,
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
                lineHeight: 1.1,
                color: "#0e1410",
                margin: 0,
              }}
            >
              {data.promo.title}
            </h4>
            <p
              style={{
                fontSize: "0.75rem",
                lineHeight: 1.5,
                color: "#8a8a8a",
                margin: 0,
              }}
            >
              {data.promo.description}
            </p>
            <button
              style={{
                width: "fit-content",
                background: "#7c5cfc",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "filter 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "brightness(0.95)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "none";
              }}
            >
              {data.promo.cta}
            </button>
          </div>
          <div style={{ width: 150, height: 210, flexShrink: 0 }}>
            <img
              src={data.promo.image}
              alt={data.promo.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function OsmoMenu() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqOrigin, setFaqOrigin] = useState<{ x: number; y: number } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);

      // Check hero section positions
      const heroShowcase = document.querySelector('[class*="hero-showcase-spotlight"]');
      const showcaseGrid = document.querySelector('[class*="showcase-grid"]');

      // Nav appears when HeroShowcase starts entering the viewport
      const heroStarted = heroShowcase
        ? heroShowcase.getBoundingClientRect().top < window.innerHeight
        : currentY > window.innerHeight * 0.8;

      // Hero fully passed — after this, hide-on-scroll behavior kicks in
      const heroFullyPassed = showcaseGrid
        ? showcaseGrid.getBoundingClientRect().top < window.innerHeight * 0.6
        : false;

      if (!heroStarted) {
        setVisible(false);
        lastScrollY.current = currentY;
        return;
      }

      // Before hero fully passes, nav always visible
      if (!heroFullyPassed) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      // After hero fully passes: scroll down → hide, scroll up → show
      const delta = currentY - lastScrollY.current;
      if (delta < -5) {
        setVisible(true);
      } else if (delta > 150) {
        setVisible(false);
      }

      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (label: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const activeData: DropdownData | null = activeDropdown ? dropdowns[activeDropdown] ?? null : null;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.4rem 1.5rem",
          background: scrolled
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(84,66,55,0.06)"
            : "1px solid transparent",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
          transition: "background 0.3s ease, border-color 0.3s ease, transform 0.4s ease, opacity 0.4s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            position: "relative",
            zIndex: 60,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "linear-gradient(135deg, #7c5cfc, #3db5b0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#0e1410",
            }}
          >
            Webdigio
          </span>
        </a>

        {/* Desktop nav links */}
        {isDesktop && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {Object.keys(dropdowns).map((label) => (
              <div
                key={label}
                style={{ position: "relative" }}
                onMouseEnter={() => handleMouseEnter(label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === label ? null : label
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    padding: "0.25rem 0.65rem",
                    borderRadius: 6,
                    border: "none",
                    background:
                      activeDropdown === label
                        ? "rgba(14,20,16,0.05)"
                        : "transparent",
                    color: "#0e1410",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {label}
                  <motion.span
                    animate={{ rotate: activeDropdown === label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex" }}
                  >
                    <ChevronDown size={12} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeDropdown === label && activeData && (
                    <div onMouseEnter={() => handleMouseEnter(label)} onMouseLeave={handleMouseLeave}>
                      <MegaDropdown
                        data={activeData}
                        onClose={() => setActiveDropdown(null)}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        )}

        {/* Desktop right actions */}
        {isDesktop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <a
              href="#"
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#544237",
                textDecoration: "none",
                padding: "0.25rem 0.5rem",
                borderRadius: 6,
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#0e1410";
                (e.currentTarget as HTMLElement).style.background = "rgba(14,20,16,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#544237";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              About
            </a>
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setFaqOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                setFaqOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#544237",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0.25rem 0.5rem",
                borderRadius: 6,
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#0e1410";
                (e.currentTarget as HTMLElement).style.background = "rgba(14,20,16,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#544237";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <HelpCircle size={14} />
              FAQ
            </button>
            <ButtonWithIcon size="sm">
              Start a project
            </ButtonWithIcon>
          </div>
        )}

        {/* Mobile hamburger */}
        {!isDesktop && (
          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{
              position: "relative",
              zIndex: 60,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "none",
              background: mobileOpen
                ? "rgba(14,20,16,0.06)"
                : "rgba(14,20,16,0.04)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
          >
            {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        )}
      </header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              overflow: "auto",
              padding: "5rem 1.5rem 2rem",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {mobileLinkBlocks.map((block) => (
                <div key={block.tagline}>
                  <div
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#7c5cfc",
                      marginBottom: "1rem",
                    }}
                  >
                    {block.tagline}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {block.links.map((link, i) => (
                      <a
                        key={link.title}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.75rem",
                          textDecoration: "none",
                          color: "#0e1410",
                          padding: "0.5rem 0",
                          fontSize: "1.05rem",
                          fontWeight: 500,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: "ui-monospace, monospace",
                            color: "rgba(14,20,16,0.3)",
                            minWidth: 22,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span>{link.title}</span>
                          {link.tag && (
                            <span
                              style={{
                                display: "block",
                                fontSize: 12,
                                color: "rgba(14,20,16,0.45)",
                                fontWeight: 400,
                                marginTop: 2,
                              }}
                            >
                              {link.tag}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <a
                href="#"
                style={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#544237",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                About
              </a>
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setFaqOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                  setMobileOpen(false);
                  setFaqOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#544237",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "0.5rem 0",
                }}
              >
                <HelpCircle size={16} />
                FAQ
              </button>
              <ButtonWithIcon onClick={() => setMobileOpen(false)}>
                Start a project
              </ButtonWithIcon>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <FaqModal open={faqOpen} onClose={() => setFaqOpen(false)} origin={faqOrigin} />
    </>
  );
}
