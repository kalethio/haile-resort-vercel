"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import CheckBooking from "./checkbooking";

// Static data for hero section
export const DATA = {
  headline: "EXPERIENCE ETHIOPIA THE HAILE WAY",
  subheadline: "Hospitality redefined across Ethiopia's finest destinations.",
  services: [
    { title: "Scenic Destinations", image: "/images/main-hero/hero1.jpg" },
    { title: "Luxurious treats", image: "/images/main-hero/hero2.jpg" },
    { title: "Lakeside Adventures", image: "/images/main-hero/hero3.jpg" },
    { title: "Nature Within Reach", image: "/images/main-hero/hero4.jpg" },
  ],
  branches: ["Addis Ababa", "Hawassa", "Arba Minch", "Ziway", "Shashemene"],
  autoAdvanceMs: 7000, // milliseconds for auto-advance
};

type Service = (typeof DATA)["services"][number];

export default function HeroHybridCarousel(): JSX.Element {
  const { headline, subheadline, services, branches, autoAdvanceMs } = DATA;
  const [index, setIndex] = useState(0);

  // Scroll-based parallax effects
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 100]); // background parallax
  const headlineY = useTransform(scrollY, [0, 500], [0, 200]); // headline
  const subheadlineY = useTransform(scrollY, [0, 500], [0, 300]); // subheadline

  // Auto-advance service carousel
  React.useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % services.length),
      autoAdvanceMs
    );
    return () => clearInterval(t);
  }, [services.length, autoAdvanceMs]);

  // Animation variants for background images
  const bgVariants = {
    enter: { opacity: 0, scale: 1.05 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <section
      aria-label="Haile Resorts premium hero"
      className="relative max-w-screen-screen h-screen overflow-hidden text-text"
    >
      {/* Background carousel */}
      <AnimatePresence initial={false}>
        {services.map((s, i) =>
          i === index ? (
            <motion.div
              key={s.title}
              className="absolute inset-0 -z-10"
              variants={bgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ y: bgY }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority
                className="object-cover scale-105"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-black/30 to-transparent" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Content wrapper */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-full sm:max-w-xl lg:w-3/5 lg:max-w-2xl">
          {/* Headline */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl tracking-tight"
            style={{ y: headlineY }}
          >
            {headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-4 sm:mt-6 max-w-full sm:max-w-lg text-base sm:text-lg text-white/90 leading-relaxed"
            style={{ y: subheadlineY }}
          >
            {subheadline}
          </motion.p>

          {/* Booking Form */}
          <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20">
            <CheckBooking />
          </div>

          {/* Dynamic Service Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={services[index].title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-6 sm:mt-10"
            >
              <h2 className="text-lg sm:text-2xl font-semibold text-primary drop-shadow">
                {services[index].title}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Branch ticker */}
          <div className="mt-6 sm:mt-10 overflow-hidden">
            <motion.div
              className="flex gap-6 sm:gap-10 py-2 text-xs sm:text-base uppercase tracking-wider whitespace-nowrap text-white/70"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
              {[...branches, ...branches].map((b, i) => (
                <span
                  key={i}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {b}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
