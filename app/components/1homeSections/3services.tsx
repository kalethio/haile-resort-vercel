"use client";

import React, { useState, useEffect } from "react";

export type Service = {
  title: string;
  description?: string;
  video: string;
};

export const SERVICES: Service[] = [
  {
    title: "Welcome to Haile Grand Addis Ababa",
    description:
      "where luxury meets the heartbeat of the city. Your unforgettable Ethiopian escape starts here",
    video: "iCS0YIJx3Ek",
  },
  {
    title: "Farm to Table",
    description:
      "Straight from our garden to your fork: Watch us pick, wash, and whip up those crisp salads and fresh herbs into something delicious. Real food, real fresh—enjoy the magic",
    video: "5j6QwqWHiNA",
  },
  {
    title: "Wellness & Recreation",
    description:
      "Relax, recharge, and play—our spas, gyms, and outdoor activities are designed for every guest.",
    video: "OvNccfVK0N4",
  },
  {
    title: "Nature's Escape & Scenic Views",
    description:
      "Unwind amidst breathtaking landscapes and immerse yourself in the serenity of nature",
    video: "0dZiTd9hcGs",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const total = SERVICES.length;

  const prev = () => setActiveIndex((s) => (s === 0 ? total - 1 : s - 1));
  const next = () => setActiveIndex((s) => (s === total - 1 ? 0 : s + 1));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Video URL with loop to prevent recommendations
  const getVideoUrl = (videoId: string) => {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=0&playsinline=1&disablekb=1&fs=0&loop=1&playlist=${videoId}`;
  };

  return (
    <section className="w-full font-sans bg-bg">
      {/* Desktop layout */}
      <div className="hidden lg:flex w-full h-[85vh] relative">
        <div className="w-3/4 h-full overflow-hidden rounded-xl shadow-2xl bg-bg">
          <iframe
            key={SERVICES[activeIndex].video}
            className="w-full h-full rounded-xl pointer-events-none"
            src={getVideoUrl(SERVICES[activeIndex].video)}
            title={SERVICES[activeIndex].title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              border: "none",
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
        </div>
        <aside className="w-1/4 h-full p-6 flex flex-col justify-between rounded-r-xl ml-4 bg-bg">
          <div>
            <div className="space-y-4">
              {SERVICES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex flex-col gap-2 border-2 ${
                    idx === activeIndex
                      ? "border-primary bg-bg/50 shadow-lg"
                      : "border-transparent hover:border-primary/30 hover:bg-bg/20"
                  }`}
                >
                  <div className="text-primary font-medium text-base">
                    {s.title}
                  </div>
                  <p className="text-primary/80 text-sm line-clamp-2">
                    {s.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-text/10">
            <div className="text-xs text-text/40">
              {activeIndex + 1} / {total}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-all"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md transition-all"
              >
                ›
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden w-full relative">
        <div className="w-full h-[60vh] md:h-[65vh] relative overflow-hidden rounded-xl shadow-2xl bg-bg">
          <iframe
            key={SERVICES[activeIndex].video}
            className="w-full h-full rounded-xl pointer-events-none"
            src={getVideoUrl(SERVICES[activeIndex].video)}
            title={SERVICES[activeIndex].title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              border: "none",
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-5 rounded-b-xl">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
              <h3 className="text-white text-center text-lg md:text-xl font-semibold leading-tight tracking-wide">
                {SERVICES[activeIndex].title}
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center shadow-lg"
                >
                  ‹
                </button>
                <div className="flex items-center gap-3">
                  {SERVICES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-3 h-3 rounded-full ${
                        i === activeIndex
                          ? "bg-primary shadow-md"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center shadow-lg"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-bg/20 flex gap-4 overflow-x-auto rounded-b-xl mt-2">
          {SERVICES.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`min-w-[160px] flex-shrink-0 p-4 rounded-lg text-left border-2 transition-all ${
                i === activeIndex
                  ? "border-primary bg-bg/50 shadow-lg"
                  : "border-transparent hover:border-primary/30 hover:bg-bg/20"
              }`}
            >
              <div className="text-text font-medium text-base">{s.title}</div>
              <div className="text-text/80 text-sm line-clamp-2">
                {s.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
