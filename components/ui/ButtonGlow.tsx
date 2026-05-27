"use client";

import React from "react";

interface ButtonGlowProps {
  children: React.ReactNode;
}

export function ButtonGlow({ children }: ButtonGlowProps) {
  return (
    <div className="group relative inline-block rounded-full bg-transparent p-0.5">
      {/* Animated gradient border */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span
          className="absolute inset-0 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(75% 100% at 50% 0%, rgba(124, 92, 252, 1) 0%, rgba(61, 181, 176, 1) 75%)",
          }}
        />
      </span>

      {/* Button content */}
      <div className="relative z-10 flex items-center rounded-full">
        {children}
      </div>

      {/* Bottom accent line */}
      <span
        className="absolute bottom-0 left-[1.125rem] h-px opacity-0 transition-opacity duration-500 group-hover:opacity-40"
        style={{
          width: "calc(100% - 2.25rem)",
          background:
            "linear-gradient(to right, rgba(124, 92, 252, 0), rgba(124, 92, 252, 0.9), rgba(61, 181, 176, 0), rgba(124, 92, 252, 0))",
        }}
      />
    </div>
  );
}
