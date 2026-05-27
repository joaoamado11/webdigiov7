"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SlidingButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function SlidingButton({
  children,
  href = "#",
  onClick,
}: SlidingButtonProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-start",
        height: 56,
        padding: "4px 12px 4px 32px",
        borderRadius: 9999,
        background: "linear-gradient(135deg, #7c5cfc, #3db5b0)",
        textDecoration: "none",
        cursor: "pointer",
        boxShadow:
          "0px 4px 16px 0px rgba(23, 23, 23, 0.04), 0px 2px 8px 0px rgba(23, 23, 23, 0.03), 0px 1px 4px 0px rgba(23, 23, 23, 0.02)",
        isolation: "isolate",
      }}
    >
      {/* Text container — shifts down on hover */}
      <motion.span
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          height: 24,
          overflow: "hidden",
        }}
        variants={{
          rest: { justifyContent: "flex-start" as const },
          hover: { justifyContent: "flex-end" as const },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
      >
        {/* Default text */}
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: "24px",
            mixBlendMode: "difference",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
        {/* Duplicate for the shift effect */}
        <span
          aria-hidden
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#7c5cfc",
            lineHeight: "24px",
            mixBlendMode: "difference",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
      </motion.span>

      {/* Expanding icon circle */}
      <motion.span
        style={{
          position: "absolute",
          right: 6,
          top: 6,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          flexShrink: 0,
        }}
        variants={{
          rest: {
            width: 44,
            height: 44,
            right: 6,
            top: 6,
            borderRadius: "50%",
          },
          hover: {
            width: "calc(100% - 12px)",
            height: "calc(100% - 12px)",
            right: 6,
            top: 6,
            borderRadius: 9999,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1,
        }}
      >
        {/* Arrow inside the circle */}
        <motion.span
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7c5cfc",
          }}
          variants={{
            rest: { left: "50%", x: "-50%" },
            hover: { left: "unset", right: 24, x: 0 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
          }}
        >
          <ArrowRight size={18} strokeWidth={2.5} />
        </motion.span>
      </motion.span>
    </motion.a>
  );
}
