"use client";

// ── Shared project data + visual ──
// Used by both the hero stacked pile (HeroShowcase) and the scroll-driven
// "Latest Projects" grid (LatestProjects) so the stack→grid transition reads
// as one continuous set of cards.

export interface Project {
  title: string;
  category: string;
  url: string;
  image: string;
  accent: string;
}

export const projects: Project[] = [
  {
    title: "Lumina Finance",
    category: "Fintech Platform",
    url: "lumina.finance",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    accent: "#7c5cfc",
  },
  {
    title: "Nova Commerce",
    category: "E-commerce",
    url: "novacommerce.io",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop",
    accent: "#3db5b0",
  },
  {
    title: "Pulse Analytics",
    category: "SaaS Dashboard",
    url: "pulse-analytics.app",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    accent: "#f59e4b",
  },
  {
    title: "Atlas Studio",
    category: "Brand & Web",
    url: "atlasstudio.design",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop",
    accent: "#4b9cf5",
  },
];

// Final 2×2 grid geometry (fractions of the measured stage). Shared by the
// hero deck→grid transition and the bridge grid→split exit so both align.
// Index order: 0 top-left, 1 top-right, 2 bottom-left, 3 bottom-right.
export const GRID_CX = [0.31, 0.69, 0.31, 0.69];
export const GRID_CY = [0.4, 0.4, 0.79, 0.79];
export const GRID_CARD_W = 0.33; // fraction of stage width (window-relative)

// Diagonal exit directions for the split (column sign × row sign).
export const SPLIT_DIR = [
  { x: -1, y: -1 }, // top-left  → up-left
  { x: 1, y: -1 }, // top-right → up-right
  { x: -1, y: 1 }, // bottom-left → down-left
  { x: 1, y: 1 }, // bottom-right → down-right
];

// Stack arrangement (progress = 0 / hero state). Index 3 sits on top.
export const STACK_ROT = [-11, -5, 4, 12];
export const STACK_OFFSET = [
  { x: -46, y: 26 },
  { x: -18, y: 8 },
  { x: 14, y: -8 },
  { x: 44, y: -26 },
];
export const STACK_SCALE = [0.88, 0.92, 0.96, 1];

// A single project rendered as a themed "browser window" card.
export function ProjectCardVisual({
  project,
  showCaption = true,
}: {
  project: Project;
  showCaption?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 24px 60px rgba(14,20,16,0.2)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0.55rem 0.85rem",
          borderBottom: "1px solid rgba(84,66,55,0.08)",
          background: "rgba(245,242,236,0.9)",
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#e8608f" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e4b" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#3db5b0" }} />
        <div
          style={{
            marginLeft: 8,
            flex: 1,
            maxWidth: 220,
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            color: "#544237",
            background: "rgba(84,66,55,0.06)",
            borderRadius: 999,
            padding: "0.2rem 0.7rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.url}
        </div>
      </div>

      {/* Screenshot */}
      <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden" }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, ${project.accent}10 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* Caption */}
      {showCaption && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "0.85rem 1rem",
            background: "rgba(255,255,255,0.92)",
          }}
        >
          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0e1410" }}>
            {project.title}
          </span>
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: project.accent,
            }}
          >
            {project.category}
          </span>
        </div>
      )}
    </div>
  );
}
