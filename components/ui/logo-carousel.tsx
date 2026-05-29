"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type LogoItem = {
  id: number;
  name: string;
  img: React.FC<{ className?: string }>;
};

// Generic placeholder brand marks (abstract icon + wordmark). Swap these for
// real client logos when available — the carousel just cycles whatever it gets.
const makeLogo =
  (name: string, glyph: React.ReactNode): React.FC<{ className?: string }> =>
  function Logo({ className = "" }) {
    return (
      <div
        className={`flex items-center gap-2.5 whitespace-nowrap ${className}`}
        style={{ color: "#544237" }}
      >
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5 shrink-0 md:h-6 md:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {glyph}
        </svg>
        <span className="text-sm font-semibold tracking-tight md:text-base">
          {name}
        </span>
      </div>
    );
  };

const DEFAULT_LOGOS: LogoItem[] = [
  { id: 1, name: "Nimbus", img: makeLogo("Nimbus", <><circle cx="16" cy="16" r="9" /><path d="M16 7v18M7 16h18" /></>) },
  { id: 2, name: "Vertex", img: makeLogo("Vertex", <><path d="M16 5l11 22H5z" /></>) },
  { id: 3, name: "Quanta", img: makeLogo("Quanta", <><rect x="6" y="6" width="9" height="9" rx="1" /><rect x="17" y="17" width="9" height="9" rx="1" /><path d="M15 10h7v7" /></>) },
  { id: 4, name: "Lumen", img: makeLogo("Lumen", <><circle cx="16" cy="16" r="6" /><path d="M16 4v3M16 25v3M4 16h3M25 16h3M8 8l2 2M22 22l2 2M24 8l-2 2M10 22l-2 2" /></>) },
  { id: 5, name: "Forge", img: makeLogo("Forge", <><path d="M6 20l10-12 10 12" /><path d="M6 20h20v4H6z" /></>) },
  { id: 6, name: "Halo", img: makeLogo("Halo", <><circle cx="16" cy="16" r="10" /><circle cx="16" cy="16" r="4" /></>) },
  { id: 7, name: "Pulse", img: makeLogo("Pulse", <><path d="M4 16h6l3-9 6 18 3-9h6" /></>) },
  { id: 8, name: "Atlas", img: makeLogo("Atlas", <><circle cx="16" cy="16" r="10" /><path d="M16 6c4 4 4 16 0 20M16 6c-4 4-4 16 0 20M6 16h20" /></>) },
];

function distributeLogos(logos: LogoItem[], columnCount: number): LogoItem[][] {
  const columns: LogoItem[][] = Array.from({ length: columnCount }, () => []);
  logos.forEach((logo, i) => columns[i % columnCount].push(logo));
  const max = Math.max(...columns.map((c) => c.length));
  columns.forEach((col) => {
    let i = 0;
    while (col.length < max) {
      col.push(logos[i % logos.length]);
      i++;
    }
  });
  return columns;
}

const CYCLE_MS = 2200;

function LogoColumn({
  logos,
  index,
  currentTime,
}: {
  logos: LogoItem[];
  index: number;
  currentTime: number;
}) {
  const total = CYCLE_MS * logos.length;
  const adjusted = (currentTime + index * 300) % total;
  const activeIndex = Math.floor(adjusted / CYCLE_MS);
  const Logo = logos[activeIndex].img;

  return (
    <motion.div
      className="relative flex h-12 w-24 items-center justify-center md:h-14 md:w-36"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${logos[activeIndex].id}-${activeIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "16%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-16%", opacity: 0, filter: "blur(3px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <Logo />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function LogoCarousel({
  columnCount = 2,
  logos = DEFAULT_LOGOS,
}: {
  columnCount?: number;
  logos?: LogoItem[];
}) {
  const [time, setTime] = useState(0);
  const columns = useMemo(
    () => distributeLogos(logos, columnCount),
    [logos, columnCount]
  );

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 100), 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-5 md:gap-8">
      {columns.map((col, i) => (
        <LogoColumn key={i} logos={col} index={i} currentTime={time} />
      ))}
    </div>
  );
}
