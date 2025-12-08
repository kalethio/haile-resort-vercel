"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Branch {
  slug: string;
  branchName: string;
  starRating: number;
  heroImage: string;
  location: {
    city: string;
    country: string;
  };
  seo: {
    title: string;
  };
}

export default function SpotlightLargeCard() {
  const [destinations, setDestinations] = useState<Branch[]>([]);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        if (response.ok) {
          const data = await response.json();
          setDestinations(data);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // expand animation on scroll - KEEPING THIS
  useEffect(() => {
    const el = containerRef.current;
    if (!el || destinations.length === 0) return;
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
  }, [expanded, destinations.length]);

  const handleSelect = (i: number) => {
    setActive(i);
    setMobileOpen(false);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % destinations.length);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full flex justify-center py-5 lg:py-20">
        <div className="w-screen lg:max-w-screen-lg mx-auto">
          <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 border border-primary/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row min-h-[75vh]">
              <div className="flex-1 relative bg-gray-200 animate-pulse" />
              <div className="w-full p-6 bg-white/90">
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gray-100 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (destinations.length === 0) {
    return (
      <section className="w-full flex justify-center py-5 lg:py-20">
        <div className="text-center text-gray-500">
          No destinations available
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center py-5 lg:py-20">
      <div
        ref={containerRef}
        style={{ transformOrigin: "left center" }}
        className={`transition-all duration-1000 ease-in-out mx-auto relative
          ${
            expanded
              ? "w-[90vw] lg:max-w-[90vw]" // Expanded to 90vw
              : "w-screen lg:w-[75vw] lg:max-w-screen-lg" // Collapsed to 75vw
          }`}
      >
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/90 border border-primary/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row min-h-[75vh]">
            {/* LEFT: Local Video Background */}
            <div className="flex-1 relative bg-black">
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  <source src="/video/resorts.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Branch info overlay - unchanged */}
              <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 md:left-10 md:bottom-10 bg-black/50 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-primary/30">
                <h3 className="text-lg sm:text-xl md:text-3xl font-serif text-white leading-snug drop-shadow-md">
                  {destinations[active].branchName}
                </h3>
                <div className="mt-2 flex items-center">
                  {renderStars(destinations[active].starRating || 4)}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-primary/80 italic">
                  Click any branch below to visit
                </p>
              </div>
            </div>

            {/* RIGHT: Branch list */}
            <aside className="w-full lg:w-80 xl:w-96 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-white/95 to-white/90 border-l border-primary/20 flex flex-col justify-center">
              <div>
                {/* MOBILE TRIGGER */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 shadow-sm border border-primary/30 text-gray-800 font-medium"
                >
                  <span className="truncate">
                    {destinations[active].branchName}
                  </span>
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

                {/* BRANCH LIST */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    mobileOpen ? "max-h-[500px] mt-3" : "max-h-0 lg:max-h-none"
                  } lg:max-h-none`}
                >
                  <div className="rounded-2xl border border-primary/20 bg-white/70 shadow-inner">
                    <div className="p-3">
                      <div className="flex flex-col gap-3">
                        {destinations.map((d, i) => {
                          const isActive = i === active;
                          return (
                            <Link
                              key={d.slug}
                              href={`/branches/${d.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelect(i);
                                // Small delay before navigation for visual feedback
                                setTimeout(() => {
                                  window.location.href = `/branches/${d.slug}`;
                                }, 150);
                              }}
                              className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-300 border relative group ${
                                isActive
                                  ? "bg-gradient-to-r from-primary/5 to-white shadow-md border-primary ring-2 ring-primary/50"
                                  : "bg-white hover:bg-gray-50 border-gray-100 hover:border-primary/30"
                              }`}
                            >
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-primary font-medium text-sm bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                                  Click to visit →
                                </span>
                              </div>

                              <div className="flex flex-col relative z-10">
                                <span
                                  className={`text-sm sm:text-base font-semibold tracking-tight ${
                                    isActive ? "text-primary" : "text-gray-700"
                                  }`}
                                >
                                  {d.branchName}
                                </span>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center gap-1">
                                    {renderStars(d.starRating || 4)}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {d.location.city}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER - Only Next button (no View details) */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleNext}
                    className="flex-1 max-w-fit sm:flex-none px-4 py-2 rounded-full bg-primary text-white hover:brightness-110 transition shadow-sm"
                  >
                    ›
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
