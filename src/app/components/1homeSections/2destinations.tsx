"use client";

import React, { useEffect, useRef, useState } from "react";

const DESTINATIONS = [
  {
    id: "addis",
    name: "Addis Ababa — The Urban Atelier",
    rating: 5,
    location: "Addis Ababa, Ethiopia",
    image: "/images/branches-section/addis.jpg",
  },
  {
    id: "hawassa",
    name: "Hawassa — Lakeside Repose",
    rating: 4,
    location: "Hawassa, Ethiopia",
    image: "/images/branches-section/hawassa.jpg",
  },
  {
    id: "jimma",
    name: "Jimma — Shoreline Maison",
    rating: 5,
    location: "Jimma, Ethiopia",
    image: "/images/branches-section/jimma.jpg",
  },
  {
    id: "adama",
    name: "Adama — Tactile Gateway",
    rating: 4,
    location: "Adama, Ethiopia",
    image: "/images/branches-section/adama.jpg",
  },
];

export default function SpotlightLargeCard(): JSX.Element {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // expand animation on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let pending: number | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.33) {
            if (!expanded) {
              if (pending) clearTimeout(pending);
              pending = window.setTimeout(() => {
                setExpanded(true);
                pending = null;
              }, 120);
            }
          } else {
            if (pending) {
              clearTimeout(pending);
              pending = null;
            }
            setExpanded(false);
          }
        });
      },
      { threshold: [0, 0.33, 0.6] }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (pending) clearTimeout(pending);
    };
  }, [expanded]);

  const handleSelect = (i: number) => {
    setActive(i);
    setMobileOpen(false);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % DESTINATIONS.length);
  };

  return (
    <section className="w-full flex justify-center py-5 lg:py-20">
      <div
        ref={containerRef}
        style={{ transformOrigin: "left center" }}
        className={`transition-all duration-1000 ease-in-out mx-auto relative
          ${
            expanded
              ? "w-screen lg:max-w-screen-xl"
              : "w-screen lg:w-[75vw] lg:max-w-screen-lg"
          }`}
      >
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 border border-primary/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row min-h-[75vh]">
            {/* LEFT: hero */}
            <div className="flex-1 relative">
              {DESTINATIONS.map((d, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={d.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive ? "opacity-100 z-20" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className={`w-full h-full object-cover transition-transform duration-[3000ms] ${
                        isActive ? "scale-100" : "scale-110"
                      }`}
                    />
                    <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 md:left-10 md:bottom-10 bg-black/50 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-primary/30">
                      <h3 className="text-lg sm:text-xl md:text-3xl font-serif text-white leading-snug drop-shadow-md">
                        {d.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-primary/80">
                        {d.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: list */}
            <aside className="w-full lg:w-80 xl:w-96 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-white/95 to-white/90 border-l border-primary/20 flex flex-col justify-center">
              <div>
                {/* MOBILE TRIGGER */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 shadow-sm border border-primary/30 text-gray-800 font-medium"
                >
                  <span className="truncate">{DESTINATIONS[active].name}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      mobileOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* DESKTOP HEADING */}
                <h4 className="hidden lg:block text-sm uppercase tracking-[0.2em] text-primary mb-4 font-semibold">
                  Where will your journey begin?
                </h4>

                {/* LIST */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    mobileOpen ? "max-h-[500px] mt-3" : "max-h-0 lg:max-h-none"
                  } lg:max-h-none`}
                >
                  <div className="rounded-2xl border border-primary/20 bg-white/70 shadow-inner">
                    <div className="p-3">
                      <div className="flex flex-col gap-3">
                        {DESTINATIONS.map((d, i) => {
                          const isActive = i === active;
                          return (
                            <button
                              key={d.id}
                              onClick={() => handleSelect(i)}
                              className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-300 border ${
                                isActive
                                  ? "bg-gradient-to-r from-primary/5 to-white shadow-md border-primary ring-2 ring-primary/50"
                                  : "bg-white hover:bg-gray-50 border-gray-100"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm sm:text-base font-semibold tracking-tight ${
                                    isActive ? "text-primary" : "text-gray-700"
                                  }`}
                                >
                                  {d.name}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  {d.location}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-gray-400">Selected</span>
                  <div className="text-sm font-medium text-primary">
                    {DESTINATIONS[active].name}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleNext}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-full bg-primary text-white hover:brightness-110 transition shadow-sm"
                  >
                    ›
                  </button>
                  <a
                    href="#"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-medium shadow hover:brightness-105 transition"
                  >
                    View details
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
