"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ButtonWithIconProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function ButtonWithIcon({
  children,
  href = "#",
  onClick,
}: ButtonWithIconProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: 48,
        padding: "4px",
        paddingLeft: hovered ? 56 : 24,
        paddingRight: hovered ? 24 : 56,
        borderRadius: 9999,
        background: "linear-gradient(135deg, #7c5cfc, #3db5b0)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.5s",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#fff",
          transition: "all 0.5s",
        }}
      >
        {children}
      </span>
      <span
        style={{
          position: "absolute",
          right: hovered ? "calc(100% - 44px)" : 4,
          top: 4,
          width: 40,
          height: 40,
          background: "#fff",
          color: "#7c5cfc",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
          transition: "all 0.5s",
        }}
      >
        <ArrowUpRight size={16} strokeWidth={2.5} />
      </span>
    </a>
  );
}
