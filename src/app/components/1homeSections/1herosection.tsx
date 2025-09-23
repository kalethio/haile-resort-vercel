"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CheckBooking from "./checkbooking";

export const DATA = {
  headline: "EXPERIENCE ETHIOPIA, THE HAILE WAY",
  subheadline: "Hospitality redefined across Ethiopia's finest destinations.",
  branches: [
    {
      slug: "addis",
      display: "Addis Ababa",
      short: "AA",
      image: "/images/main-hero/hero1.jpg",
    },
    {
      slug: "hawassa",
      display: "Hawassa",
      short: "HW",
      image: "/images/main-hero/hero2.jpg",
    },
    {
      slug: "arbaminch",
      display: "Arba Minch",
      short: "AM",
      image: "/images/main-hero/hero3.jpg",
    },
    {
      slug: "ziway",
      display: "Ziway",
      short: "ZW",
      image: "/images/main-hero/hero4.jpg",
    },
  ],
  autoAdvanceMs: 7000,
};

type Branch = (typeof DATA)["branches"][number];

export default function HeroHybridCarousel(): JSX.Element {
  const { headline, subheadline, branches, autoAdvanceMs } = DATA;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % branches.length),
      autoAdvanceMs
    );
    return () => clearInterval(t);
  }, [branches.length, autoAdvanceMs, paused]);

  const prev = () =>
    setIndex((i) => (i - 1 + branches.length) % branches.length);
  const next = () => setIndex((i) => (i + 1) % branches.length);

  const bgVariants = {
    enter: (direction: number) => ({ opacity: 0, x: 40 * direction }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: -40 * direction }),
  };

  return (
    <section
      aria-label="Haile Resorts featured locations"
      className="relative w-full h-screen overflow-hidden text-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background carousel */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false} custom={1}>
          {branches.map((b, i) =>
            i === index ? (
              <motion.div
                key={b.slug}
                className="relative w-full h-full"
                custom={1}
                variants={bgVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.9 }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* Next.js Image */}
                <Image
                  src={b.image}
                  alt={b.display}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Content container */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          {/* LEFT: Text and Booking */}
          <div className="lg:col-span-14 col-span-1 z-20">
            <h1 className="mt-6 max-w-xl text-3xl sm:text-4xl md:text-5xl leading-tight font-display tracking-widest text-white">
              <span
                className="text-2xl sm:text-3xl md:text-4xl block"
                style={{ fontFamily: "Lithos, serif" }}
              >
                {headline}
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm sm:text-base text-white/90 font-sans">
              {subheadline}
            </p>

            {/* Modular Booking Form */}
            <CheckBooking />

            {/* Secondary CTA */}

            <p className="mt-4 text-xs text-white/70 max-w-sm">
              Free cancellation up to 24 hours before check-in.
            </p>
          </div>

          {/* RIGHT: spacing / visual carousel */}
          <div className="lg:col-span-7 col-span-1 z-10">
            <div className="hidden lg:block h-96" />
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 top-1/2 z-30 hidden md:flex flex-col gap-2 transform -translate-y-1/2">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="rounded-full bg-white/10 p-2 shadow hover:bg-white/20"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="rounded-full bg-white/10 p-2 shadow hover:bg-white/20"
          >
            ›
          </button>
        </div>

        {/* Branch indicators */}
        <div className="absolute left-6 bottom-6 z-30 flex items-center gap-3">
          {branches.map((b, i) => (
            <button
              key={b.slug}
              onClick={() => setIndex(i)}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                i === index
                  ? "bg-white/90 text-black shadow-lg scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
              aria-current={i === index}
              aria-label={`View ${b.display} branch`}
            >
              <span className="font-mono tracking-tight">{b.short}</span>
              <span className="hidden sm:inline">{b.display}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Decorative SVG motif */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-full w-40 opacity-5"
        viewBox="0 0 200 800"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#78112D" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#D8E032" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
    </section>
  );
}
