"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** 0..1 — visibility of the silk canvas. 0 = invisible, 1 = fully visible. */
  opacity: number;
  /** When opacity is below this threshold, the animation loop pauses to save CPU. Default 0.01. */
  pauseThreshold?: number;
};

/**
 * Animated silk background canvas — flowing diagonal wave grids over a
 * teal/peach gradient. Designed to sit fixed behind the page (z-index: -1).
 *
 * Implementation ports the user-provided vanilla snippet into React:
 * - Two diagonal wave bands (slopes -0.15 and +0.12) with 10 line strata each
 * - Ribbon fills (very low alpha) between adjacent strata
 * - Soft white gradient stroke on each line
 * - Phase shifts per stratum so the lines weave with subtle parallax
 *
 * Perf:
 * - When `opacity` is below `pauseThreshold`, the rAF loop is not scheduled
 *   (canvas stays at its last drawn frame, but it's invisible anyway).
 * - DPR-aware resolution so it stays crisp on retina.
 */
export default function SilkBackground({
  opacity,
  pauseThreshold = 0.01,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const tickRef = useRef(0);
  const opacityRef = useRef(opacity);
  // Stable seeds for the two wave bands (random per mount so each session is unique).
  const seedsRef = useRef<[number, number]>([
    Math.random() * 100,
    Math.random() * 100,
  ]);

  // Keep latest opacity in a ref so the rAF loop can read it without re-binding.
  useEffect(() => {
    opacityRef.current = opacity;
  }, [opacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Internal animation config — matches the user-provided snippet.
    const speed = 1.0;
    const complexity = 10;
    const spacing = 15;
    const thickness = 1.0;
    const waveCount = 2;
    const slopes = [-0.15, 0.12];

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      // Pause when invisible to save CPU.
      if (opacityRef.current < pauseThreshold) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Fill background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#d4e8eb");
      bgGrad.addColorStop(0.35, "#fae3d9");
      bgGrad.addColorStop(0.7, "#a1dadb");
      bgGrad.addColorStop(1, "#5bb2b6");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      tickRef.current += 0.004 * speed;
      const tick = tickRef.current;

      const stepX = 15;
      const pointsCount = Math.ceil(width / stepX) + 1;

      for (let w = 0; w < waveCount; w++) {
        const baseY = height * (0.4 + w * 0.2);
        const linePoints: Float32Array[] = [];

        for (let l = 0; l < complexity; l++) {
          linePoints[l] = new Float32Array(pointsCount);
          const lineOffset = (l - complexity / 2) * spacing * 0.35;
          const phaseShift = l * 0.035;
          const ampScale = 1.0 + (l - complexity / 2) * 0.035;

          let idx = 0;
          for (let x = 0; x <= width + stepX; x += stepX) {
            const angle1 = x * 0.0011 + tick * 0.35 + seedsRef.current[w] + phaseShift;
            const angle2 = x * 0.0025 - tick * 0.2 + seedsRef.current[w] * 1.5;
            const slopeY = slopes[w] * (x - width / 2);
            const y =
              baseY +
              slopeY +
              Math.sin(angle1) * 115 * ampScale +
              Math.sin(angle2) * 40 +
              lineOffset;
            linePoints[l][idx++] = y;
          }
        }

        // Ribbon fills between adjacent strata
        for (let l = 0; l < complexity - 1; l++) {
          ctx.beginPath();
          ctx.moveTo(0, linePoints[l][0]);
          for (let i = 1; i < pointsCount; i++) ctx.lineTo(i * stepX, linePoints[l][i]);
          for (let i = pointsCount - 1; i >= 0; i--)
            ctx.lineTo(i * stepX, linePoints[l + 1][i]);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.022)";
          ctx.fill();
        }

        // Stroke gradient — fades in from edges
        const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
        strokeGrad.addColorStop(0, "rgba(255,255,255,0)");
        strokeGrad.addColorStop(0.15, "rgba(255,255,255,0.45)");
        strokeGrad.addColorStop(0.5, "rgba(180,230,235,0.3)");
        strokeGrad.addColorStop(0.85, "rgba(255,255,255,0.45)");
        strokeGrad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = thickness;

        for (let l = 0; l < complexity; l++) {
          ctx.beginPath();
          ctx.moveTo(0, linePoints[l][0]);
          for (let i = 1; i < pointsCount; i++) ctx.lineTo(i * stepX, linePoints[l][i]);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [pauseThreshold]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        // Fallback gradient (shown when canvas hasn't drawn yet or animation is paused)
        background:
          "linear-gradient(135deg, #d4e8eb 0%, #fae3d9 35%, #a1dadb 70%, #5bb2b6 100%)",
        opacity,
        // No CSS transition — opacity is already driven smoothly by scroll progress.
        // A transition here would fight scroll input and cause visible lag.
        willChange: "opacity",
      }}
    />
  );
}
