"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music2, Radio, Tv, Camera } from "lucide-react";

const BAR_COUNT = 23;

const discoverLinks = [
  { href: "#", label: "Labs & Workshops" },
  { href: "#", label: "Deep Dive Series" },
  { href: "#", label: "Global Circle" },
  { href: "#", label: "Resource Vault" },
  { href: "#", label: "Future Roadmap" },
];

const missionLinks = [
  { href: "#", label: "Origin Story" },
  { href: "#", label: "The Collective" },
  { href: "#", label: "Newsroom Hub" },
  { href: "#", label: "Join the Team" },
];

const conciergeLinks = [
  { href: "#", label: "Get in Touch" },
  { href: "#", label: "Legal Privacy" },
  { href: "#", label: "User Agreement" },
  { href: "#", label: "Report Concern" },
];

const socialIcons = [
  { Icon: Music2, href: "#", label: "Music" },
  { Icon: Radio, href: "#", label: "Twitter" },
  { Icon: Tv, href: "#", label: "YouTube" },
  { Icon: Camera, href: "#", label: "Instagram" },
];

export default function Footer() {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let t = 0;
    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;
      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });
      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    if (isVisible) {
      animateWave();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isVisible]);

  return (
    <motion.footer
      ref={footerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      className="liquid-glass w-full rounded-3xl p-6 md:p-10 text-white/70 mt-8 md:mt-16"
      style={{ marginBottom: 0 }}
    >
      {/* Top grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-10">
        {/* Brand column */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg, #7c5cfc, #3db5b0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              W
            </div>
            <span className="text-xl font-medium text-white">Webdigio</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            Premium digital agency crafting high-performance websites, mobile apps,
            and AI-powered tools for ambitious brands.
          </p>
        </div>

        {/* Links columns */}
        <div className="md:col-span-7 grid grid-cols-3 gap-8">
          <div>
            <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
              Discover
            </h4>
            <ul className="space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
              The Mission
            </h4>
            <ul className="space-y-2">
              {missionLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-4">
              Concierge
            </h4>
            <ul className="space-y-2">
              {conciergeLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        <p className="text-[10px] uppercase tracking-widest opacity-50">
          Curated by Webdigio
        </p>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-widest opacity-50">
            Join the Journey:
          </span>
          <div className="flex items-center gap-3">
            {socialIcons.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="opacity-70 hover:opacity-100 transition-colors hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Animated wave bars */}
      <div
        aria-hidden="true"
        style={{ overflow: "hidden", height: 120, marginTop: "1.5rem" }}
      >
        <div style={{ marginTop: 0 }}>
          {Array.from({ length: BAR_COUNT }).map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                waveRefs.current[index] = el;
              }}
              style={{
                height: `${index + 1}px`,
                backgroundColor: "rgb(255, 255, 255)",
                transition: "transform 0.1s ease",
                willChange: "transform",
                marginTop: "-2px",
                opacity: 0.15 + index * 0.02,
              }}
            />
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
