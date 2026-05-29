"use client";

import React from "react";

type GradientHeadingProps = {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "light";
  size?: "sm" | "default" | "lg" | "xl" | "xxl" | "xxxl";
  weight?: "thin" | "base" | "semi" | "bold";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

const sizeMap: Record<NonNullable<GradientHeadingProps["size"]>, string> = {
  sm: "text-sm",
  default: "text-lg",
  lg: "text-2xl sm:text-3xl",
  xl: "text-3xl sm:text-4xl",
  xxl: "text-4xl sm:text-5xl md:text-6xl",
  xxxl: "text-5xl sm:text-6xl md:text-7xl",
};

const weightMap: Record<NonNullable<GradientHeadingProps["weight"]>, string> = {
  thin: "font-light",
  base: "font-normal",
  semi: "font-semibold",
  bold: "font-bold",
};

export function GradientHeading({
  children,
  variant = "default",
  size = "default",
  weight = "semi",
  className = "",
  as = "h3",
}: GradientHeadingProps) {
  const Tag = as as React.ElementType;

  const style: React.CSSProperties =
    variant === "secondary"
      ? { color: "#544237" }
      : variant === "light"
        ? { color: "rgba(84,66,55,0.45)" }
        : {
            backgroundImage:
              "linear-gradient(135deg, #7c5cfc 0%, #3db5b0 50%, #f59e4b 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          };

  return (
    <Tag
      className={`tracking-tight leading-tight ${sizeMap[size]} ${weightMap[weight]} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

export default GradientHeading;
