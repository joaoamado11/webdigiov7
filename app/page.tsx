"use client";

import { useState, useRef } from "react";
import FrameSequence from "@/components/ui/FrameSequence";
import { Component as HeroOverlay } from "@/components/ui/hero-section";
import SilkBackground from "@/components/ui/SilkBackground";
import ScrollShowcase from "@/components/ui/ScrollShowcase";
import StickyCards from "@/components/ui/StickyCards";
import HeroShowcase from "@/components/ui/HeroShowcase";
import ParallaxReveal from "@/components/ui/ParallaxReveal";
import FeatureCarouselSection from "@/components/ui/FeatureCarouselSection";
import OrbitCarousel from "@/components/ui/OrbitCarousel";
import PricingSection from "@/components/ui/PricingSection";
import Footer from "@/components/ui/Footer";

const FRAME_COUNT = 220;
const FRAMES_FOR_SILK = 25;
const SILK_START = (FRAME_COUNT - FRAMES_FOR_SILK) / FRAME_COUNT; // ≈ 0.886
const OVERLAY_FADE_END = 0.6;
const HERO_COMPLETE_THRESHOLD = 0.95;

export default function HomePage() {
  const [heroProgress, setHeroProgress] = useState(0);
  const heroCompleteRef = useRef(false);

  // Once the hero finishes, lock silk permanently at opacity 1.
  // Before then, track the fade-in window from the frame sequence.
  if (heroProgress >= HERO_COMPLETE_THRESHOLD) {
    heroCompleteRef.current = true;
  }

  const heroComplete = heroCompleteRef.current;
  const silkRange = 1 - SILK_START;
  const silkOpacity = heroComplete
    ? 1
    : silkRange > 0
      ? Math.max(0, Math.min(1, (heroProgress - SILK_START) / silkRange))
      : 0;

  return (
    <>
      <SilkBackground opacity={silkOpacity} />
      <main>
        <FrameSequence
          framePattern="/frames/ezgif-frame-{n}.png"
          frameCount={FRAME_COUNT}
          pad={3}
          startIndex={1}
          scrollRangeVh={4}
          overlay={<HeroOverlay />}
          overlayStartProgress={OVERLAY_FADE_END}
          overlayFadeDirection="out"
          fadeCanvasOut
          canvasFadeStart={SILK_START}
          onProgress={setHeroProgress}
          slowdownEndFrames={10}
          slowdownEndFactor={2}
        />

        {/* Hero Showcase — scroll-driven reveal: page pauses visually, content appears piece by piece */}
        <HeroShowcase />

        {/* Scroll Showcase — glassmorph cards over the silk */}
        <ScrollShowcase />

        {/* Sticky Cards — stacked showcase with entrance animations */}
        <StickyCards />

        {/* Feature Carousel — interactive step-by-step process showcase */}
        <FeatureCarouselSection />

{/* Orbit Carousel — 3D rotating card carousel */}
        <OrbitCarousel />

        {/* Pricing — premium plans with parallax */}
        <PricingSection />

        {/* Parallax Reveal — a new page slides up from below as you scroll */}
        <ParallaxReveal />
      </main>

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(180deg, #1a2320 0%, #0e1410 100%)",
          padding: "4rem 1.5rem 2rem",
          display: "flex",
          justifyContent: "center",
          marginTop: "-1px",
        }}
      >
        <div style={{ maxWidth: 1200, width: "100%" }}>
          <Footer />
        </div>
      </div>
    </>
  );
}
