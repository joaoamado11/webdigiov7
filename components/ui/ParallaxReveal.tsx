"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import ButtonWithIcon from "@/components/ui/ButtonWithIcon";

const colors = {
  ink: "#0e1410",
  subdued: "#3c4237",
  muted: "#544237",
};

export default function ParallaxReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      const p = -rect.top / total;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The page slides up from below — starts at translateY(100%) and reaches 0% at progress=1
  const translateY = (1 - progress) * 100;
  const borderRadius = progress < 0.95 ? `${Math.round((1 - progress) * 32)}px` : "0px";
  const shadowOpacity = 1 - progress;
  const contentOpacity = Math.max(0, Math.min(1, (progress - 0.15) / 0.4));

  return (
    <section
      ref={sectionRef}
      className="glass-section"
      style={{
        position: "relative",
        height: "150vh",
      }}
    >
      {/* Sticky wrapper — pins the reveal in the viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* The rising page */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${translateY}%)`,
            borderRadius,
            background: "linear-gradient(180deg, #0e1410 0%, #1a2320 100%)",
            boxShadow:
              shadowOpacity > 0
                ? `0 -20px 80px rgba(0,0,0,${(shadowOpacity * 0.5).toFixed(2)})`
                : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            transition: "border-radius 0.1s linear",
            willChange: "transform",
          }}
        >
          {/* Content — fades in once the page has come up a bit */}
          <div
            style={{
              opacity: contentOpacity,
              transform: `translateY(${(1 - contentOpacity) * 30}px)`,
              transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
              textAlign: "center",
              maxWidth: 720,
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#3db5b0",
                marginBottom: "1.5rem",
              }}
            >
              Ready to build?
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                margin: 0,
                marginBottom: "1.5rem",
              }}
            >
              Let&rsquo;s create something
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #7c5cfc, #3db5b0, #f59e4b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                extraordinary
              </span>
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                maxWidth: "48ch",
                margin: "0 auto 2.5rem auto",
              }}
            >
              Every project starts with a conversation. Tell us about your vision
              and we&rsquo;ll craft a digital experience that exceeds every expectation.
            </p>

            <ButtonWithIcon>
              Start a project
            </ButtonWithIcon>
          </div>

          {/* Bottom accent line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              right: "10%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(124,92,252,0.4), rgba(61,181,176,0.4), transparent)",
              opacity: progress,
            }}
          />
        </div>
      </div>
    </section>
  );
}
