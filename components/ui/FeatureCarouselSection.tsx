"use client";

import { Component } from "@/components/ui/feature-carousel";

const images = {
  step1light1:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2340&auto=format&fit=crop",
  step1light2:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2340&auto=format&fit=crop",
  step2light1:
    "https://images.unsplash.com/photo-1581291518633-83b4eef13d03?q=80&w=2340&auto=format&fit=crop",
  step2light2:
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=2340&auto=format&fit=crop",
  step3light:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2340&auto=format&fit=crop",
  step4light:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  alt: "Webdigio process",
};

export default function FeatureCarouselSection() {
  return (
    <section className="glass-section" style={{ padding: "6rem 0" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            marginBottom: "3.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#3db5b0",
            }}
          >
            How we work
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0e1410",
              margin: 0,
            }}
          >
            From concept to launch
            <br />
            in four deliberate steps
          </h2>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="rounded-[34px] bg-neutral-700/20 p-2">
            <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-neutral-950 p-2">
              <Component
                title="How we work"
                description="Our proven process takes your project from vision to reality."
                step1img1Class={[
                  "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500",
                  "max-md:scale-[160%] max-md:rounded-[24px] rounded-[24px] left-[25%] top-[57%] md:left-[35px] md:top-[29%]",
                  "md:group-hover:translate-y-2",
                ].join(" ")}
                step1img2Class={[
                  "pointer-events-none w-[60%] border border-stone-100/10 transition-all duration-500 overflow-hidden",
                  "max-md:scale-[160%] rounded-2xl max-md:rounded-[24px] left-[69%] top-[53%] md:top-[21%] md:left-[calc(50%+35px+1rem)]",
                  "md:group-hover:-translate-y-6",
                ].join(" ")}
                step2img1Class={[
                  "pointer-events-none w-[50%] rounded-t-[24px] overflow-hidden border border-stone-100/10 transition-all duration-500",
                  "max-md:scale-[160%] left-[25%] top-[69%] md:left-[35px] md:top-[30%]",
                  "md:group-hover:translate-y-2",
                ].join(" ")}
                step2img2Class={[
                  "pointer-events-none w-[40%] rounded-t-[24px] border border-stone-100/10 transition-all duration-500 rounded-2xl overflow-hidden",
                  "max-md:scale-[140%] left-[70%] top-[53%] md:top-[25%] md:left-[calc(50%+27px+1rem)]",
                  "md:group-hover:-translate-y-6",
                ].join(" ")}
                step3imgClass={[
                  "pointer-events-none w-[90%] border border-stone-100/10 rounded-t-[24px] transition-all duration-500 overflow-hidden",
                  "left-[5%] top-[50%] md:top-[30%] md:left-[68px]",
                ].join(" ")}
                step4imgClass={[
                  "pointer-events-none w-[90%] border border-stone-100/10 rounded-t-[24px] transition-all duration-500 overflow-hidden",
                  "left-[5%] top-[50%] md:top-[30%] md:left-[68px]",
                ].join(" ")}
                image={images}
                bgClass=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
