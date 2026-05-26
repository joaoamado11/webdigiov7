"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Path pattern for frames. Use `{n}` as the index placeholder. */
  framePattern: string;
  /** Total number of frames in the sequence. */
  frameCount: number;
  /** Zero-pad the index in the URL. Default: 3 → `001`, `002`, …. */
  pad?: number;
  /** Starting frame number. Default 1 (i.e. frame URLs go from 1 to frameCount inclusive). */
  startIndex?: number;
  /** Total scroll distance over which the sequence plays, expressed as a multiple of the viewport height. Default 4 → 400vh. */
  scrollRangeVh?: number;
  /** Progress threshold for the overlay's opacity transition.
   *  - direction "in":  overlay fades 0→1 over [overlayStartProgress, 1]
   *  - direction "out": overlay fades 1→0 over [0, overlayStartProgress]
   *  Default 0.8.
   */
  overlayStartProgress?: number;
  /** Direction of the overlay fade. "in" = invisible→visible (default), "out" = visible→invisible. */
  overlayFadeDirection?: "in" | "out";
  /** Optional overlay to render on top of the sequence. */
  overlay?: React.ReactNode;
  /** Background color shown behind the canvas (matches frame edges). Default black. */
  background?: string;
  /** If true, fade the frame canvas to transparent in its own configurable window. */
  fadeCanvasOut?: boolean;
  /** Progress at which the canvas begins its fade-out (when `fadeCanvasOut` is true). Defaults to `overlayStartProgress` for backwards compatibility. */
  canvasFadeStart?: number;
  /** Called on every scroll tick with the current 0..1 progress through the sequence. */
  onProgress?: (progress: number) => void;
  /** Number of trailing frames whose scroll-mapping is stretched (slower). Default 0 (purely linear). */
  slowdownEndFrames?: number;
  /** How much slower the trailing frames feel. 1 = linear (no effect), 2 = each of those frames takes 2x as much scroll, etc. Default 1. */
  slowdownEndFactor?: number;
};

/**
 * Scroll-driven frame sequence.
 *
 * - Preloads all frames as Image() objects.
 * - Maps scroll progress through a tall container to frame index.
 * - Draws the current frame onto a single <canvas> sized to the viewport,
 *   covered with object-fit: cover semantics.
 * - When `overlay` is provided and progress >= overlayStartProgress, the
 *   overlay fades in on top (mapped linearly from start..1).
 *
 * Notes:
 * - The first paint shows a loader (% complete) until enough frames are
 *   preloaded; sequence becomes interactive once first frame is decoded.
 * - Scroll is throttled to requestAnimationFrame for smoothness.
 * - Frame swap reverses naturally with scroll direction (it's just a lookup).
 */
export default function FrameSequence({
  framePattern,
  frameCount,
  pad = 3,
  startIndex = 1,
  scrollRangeVh = 4,
  overlayStartProgress = 0.8,
  overlay,
  background = "#000",
  fadeCanvasOut = false,
  canvasFadeStart,
  overlayFadeDirection = "in",
  onProgress,
  slowdownEndFrames = 0,
  slowdownEndFactor = 1,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef(0);
  const onProgressRef = useRef(onProgress);

  // Keep latest onProgress in a ref so the rAF loop doesn't need to re-bind.
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [canvasOpacity, setCanvasOpacity] = useState(1);

  // Preload all frames.
  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(frameCount);
    let done = 0;

    const onOne = () => {
      if (cancelled) return;
      done += 1;
      setLoadedCount(done);
      // First frame ready → we can start drawing.
      if (done === 1) setReady(true);
    };

    for (let i = 0; i < frameCount; i++) {
      const n = (startIndex + i).toString().padStart(pad, "0");
      const url = framePattern.replace("{n}", n);
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      img.onload = onOne;
      img.onerror = onOne;
      imgs[i] = img;
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
      imgs.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [framePattern, frameCount, pad, startIndex]);

  // Set canvas resolution to viewport dimensions × DPR.
  useEffect(() => {
    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      // Repaint current frame after resize.
      drawFrame(currentFrameRef.current);
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw a single frame at given index onto the canvas, object-fit: cover.
  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    // object-fit: cover math
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Compute scroll progress through this section.
  // Returns 0 when section top is at viewport top, 1 when bottom of scroll range is reached.
  const computeProgress = (): number => {
    const sec = sectionRef.current;
    if (!sec) return 0;
    const rect = sec.getBoundingClientRect();
    const totalScrollable = sec.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return 0;
    const scrolled = -rect.top;
    const p = scrolled / totalScrollable;
    return Math.max(0, Math.min(1, p));
  };

  // Scroll listener via rAF.
  useEffect(() => {
    if (!ready) return;
    // Remap scroll progress (0..1) to a frame index (0..frameCount-1).
    // If slowdownEndFrames > 0 and slowdownEndFactor > 1, the last N frames
    // are allocated proportionally more of the scroll range — making the
    // tail of the sequence feel slower / more deliberate.
    const progressToFrameIdx = (p: number): number => {
      const N = frameCount - 1;
      if (slowdownEndFrames <= 0 || slowdownEndFactor <= 1) {
        return Math.round(p * N);
      }
      const linearFrames = Math.max(0, N - slowdownEndFrames);
      const slowWeight = slowdownEndFrames * slowdownEndFactor;
      const T = linearFrames / (linearFrames + slowWeight); // breakpoint in progress
      if (p <= T) {
        // Linear region: progress 0..T → frames 0..linearFrames
        return Math.round((p / Math.max(T, 1e-6)) * linearFrames);
      }
      // Slowdown region: progress T..1 → frames linearFrames..N
      const local = (p - T) / Math.max(1 - T, 1e-6);
      return Math.round(linearFrames + local * slowdownEndFrames);
    };

    const tick = () => {
      rafRef.current = 0;
      const progress = computeProgress();
      const targetIdx = progressToFrameIdx(progress);
      if (targetIdx !== currentFrameRef.current) {
        currentFrameRef.current = targetIdx;
        drawFrame(targetIdx);
      }
      // Overlay opacity — direction-dependent.
      let overlayOp = 0;
      if (overlayFadeDirection === "out") {
        // Visible at p=0, fades to 0 at p=overlayStartProgress.
        if (overlayStartProgress > 0) {
          overlayOp = Math.max(0, Math.min(1, 1 - progress / overlayStartProgress));
        }
      } else {
        // Invisible at p=overlayStartProgress, fades to 1 at p=1 (default behavior).
        const inRange = 1 - overlayStartProgress;
        overlayOp =
          inRange > 0
            ? Math.max(0, Math.min(1, (progress - overlayStartProgress) / inRange))
            : 0;
      }

      // Canvas fade-out — independent timing.
      const cFadeStart = canvasFadeStart ?? overlayStartProgress;
      const cRange = 1 - cFadeStart;
      const cLocal =
        cRange > 0 ? Math.max(0, Math.min(1, (progress - cFadeStart) / cRange)) : 0;

      if (overlay) setOverlayOpacity(overlayOp);
      if (fadeCanvasOut) setCanvasOpacity(1 - cLocal);
      // Report progress upstream.
      if (onProgressRef.current) onProgressRef.current(progress);
    };
    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    // Initial paint: compute current scroll position and draw the matching
    // frame. Do NOT force-draw frame 0 here — that would briefly flash to
    // frame 0 if the effect ever re-runs while the user is scrolled mid-way.
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // IMPORTANT: do NOT include `overlay` in this dependency array. `overlay`
    // is JSX from the parent and gets a new reference on every parent render
    // (Page re-renders on every scroll tick due to its `progress` state).
    // Including it caused the effect to tear down + re-run on every scroll,
    // making each tick visibly flash to a wrong frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    frameCount,
    overlayStartProgress,
    fadeCanvasOut,
    canvasFadeStart,
    overlayFadeDirection,
    slowdownEndFrames,
    slowdownEndFactor,
  ]);

  const progressPct = Math.round((loadedCount / frameCount) * 100);
  const fullyLoaded = loadedCount === frameCount;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: `${scrollRangeVh * 100}vh`,
        // When fading the canvas out (e.g. to reveal a SilkBackground behind),
        // keep the section transparent so the underlying page bg can show through.
        background: fadeCanvasOut ? "transparent" : background,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            opacity: canvasOpacity,
            willChange: "opacity",
          }}
        />

        {/* Loader — visible until at least the first frame is ready. */}
        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
              color: "#e6e1d7",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            <div>LOADING SEQUENCE</div>
            <div style={{ width: 240, height: 1, background: "rgba(230,225,215,0.15)", overflow: "hidden" }}>
              <div
                style={{
                  width: progressPct + "%",
                  height: "100%",
                  background: "#c8b4a0",
                  transition: "width 200ms linear",
                }}
              />
            </div>
            <div style={{ opacity: 0.6 }}>
              {loadedCount} / {frameCount}
            </div>
          </div>
        )}

        {/* Background loading indicator if user starts scrolling before all frames are in. */}
        {ready && !fullyLoaded && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: "6px 10px",
              fontFamily: "ui-monospace, Menlo, Consolas, monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(230,225,215,0.55)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              borderRadius: 4,
            }}
          >
            BUFFERING · {progressPct}%
          </div>
        )}

        {/* Overlay (fades in on the last segment of the sequence). */}
        {overlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: overlayOpacity,
              pointerEvents: overlayOpacity > 0.5 ? "auto" : "none",
              willChange: "opacity",
            }}
          >
            {overlay}
          </div>
        )}
      </div>
    </section>
  );
}
