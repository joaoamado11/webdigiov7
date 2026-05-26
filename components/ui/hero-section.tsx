"use client";

import React, { useEffect } from "react";

// Darker palette: anchors the text against the (mostly light) frame backgrounds.
// `ink` is the strongest reading color; `subdued` is for secondary lines.
const colors = {
  ink: "#0e1410",     // near-black with a faint green undertone
  subdued: "#3c4237", // dark sage for secondary text
  muted: "#544237",   // warm dark brown for mono labels
  hair: "#1a1d18",    // tiny divider hairlines
};

export function Component() {
  useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>(".word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });

    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(20, 24, 22, 0.25)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });
  }, []);

  return (
    <div className="min-h-screen font-primary overflow-hidden relative w-full">
      <div className="relative z-10 flex flex-col justify-between h-screen px-8 pt-10 pb-8 md:px-16 md:pt-16 md:pb-12 gap-3 md:gap-4">
        {/* Top group */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          {/* Eyebrow line */}
          <div className="text-center">
            <h2
              className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em]"
              style={{ color: colors.muted }}
            >
              <span className="word" data-delay="0">
                Welcome
              </span>
              <span className="word" data-delay="200">
                to
              </span>
              <span className="word" data-delay="400">
                <b>StackPilot</b>
              </span>
              <span className="word" data-delay="600">
                —{" "}
              </span>
              <span className="word" data-delay="800">
                Powering
              </span>
              <span className="word" data-delay="1000">
                your
              </span>
              <span className="word" data-delay="1200">
                digital
              </span>
              <span className="word" data-delay="1400">
                transformation.
              </span>
            </h2>
            <div
              className="mt-3 w-16 h-px opacity-40 mx-auto"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.hair}, transparent)`,
              }}
            ></div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
              style={{ color: colors.ink }}
            >
              <div className="mb-1 md:mb-2">
                <span className="word" data-delay="1600">
                  Supercharge
                </span>
                <span className="word" data-delay="1750">
                  your
                </span>
                <span className="word" data-delay="1900">
                  productivity
                </span>
                <span className="word" data-delay="2050">
                  with
                </span>
                <span className="word" data-delay="2200">
                  AI-driven
                </span>
                <span className="word" data-delay="2350">
                  automation.
                </span>
              </div>
              <div
                className="text-2xl md:text-3xl lg:text-4xl font-thin leading-snug"
                style={{ color: colors.subdued }}
              >
                <span className="word" data-delay="2600">
                  Integrate,
                </span>
                <span className="word" data-delay="2750">
                  orchestrate,
                </span>
                <span className="word" data-delay="2900">
                  and
                </span>
                <span className="word" data-delay="3050">
                  scale
                </span>
                <span className="word" data-delay="3200">
                  your
                </span>
                <span className="word" data-delay="3350">
                  business
                </span>
                <span className="word" data-delay="3500">
                  — all
                </span>
                <span className="word" data-delay="3650">
                  in
                </span>
                <span className="word" data-delay="3800">
                  one
                </span>
                <span className="word" data-delay="3950">
                  secure
                </span>
                <span className="word" data-delay="4100">
                  platform.
                </span>
              </div>
            </h1>
          </div>
        </div>

        {/* Bottom — anchored to viewport bottom */}
        <div className="text-center">
          <h2
            className="text-xs md:text-sm font-mono font-light uppercase tracking-[0.2em]"
            style={{ color: colors.muted }}
          >
            <span className="word" data-delay="4400">
              Real-time
            </span>
            <span className="word" data-delay="4550">
              analytics,
            </span>
            <span className="word" data-delay="4700">
              seamless
            </span>
            <span className="word" data-delay="4850">
              integrations,
            </span>
            <span className="word" data-delay="5000">
              enterprise-grade
            </span>
            <span className="word" data-delay="5150">
              security.
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}
