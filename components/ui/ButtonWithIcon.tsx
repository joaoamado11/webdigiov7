"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ButtonWithIconProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "default" | "sm";
}

export default function ButtonWithIcon({
  children,
  href = "#",
  onClick,
  size = "default",
}: ButtonWithIconProps) {
  const [hovered, setHovered] = useState(false);
  const sm = size === "sm";

  const height = sm ? 32 : 48;
  const innerSize = sm ? 26 : 40;
  const innerOffset = sm ? 3 : 4;
  const collapsedPad = sm ? 16 : 24;
  const expandedPad = sm ? 38 : 56;
  const fontSize = sm ? "0.7rem" : "0.875rem";
  const iconSize = sm ? 12 : 16;
  const collapsedRight = sm ? `calc(100% - ${innerSize + innerOffset}px)` : "calc(100% - 44px)";

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
        height,
        padding: `${innerOffset}px`,
        paddingLeft: hovered ? expandedPad : collapsedPad,
        paddingRight: hovered ? collapsedPad : expandedPad,
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
          fontSize,
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
          right: hovered ? collapsedRight : innerOffset,
          top: innerOffset,
          width: innerSize,
          height: innerSize,
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
        <ArrowUpRight size={iconSize} strokeWidth={2.5} />
      </span>
    </a>
  );
}
