"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Attraction type
export interface Attraction {
  id: string;
  label: string;
  image: string;
}

// Branch type
export interface Branch {
  branchName: string;
  heroImage: string;
  description: string;
  directionsUrl?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  attractions: Attraction[];
}

// Props for HeroAttractions
interface HeroAttractionsProps {
  branch: Branch;
}

export default function HeroAttractions({ branch }: HeroAttractionsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Active attraction or fallback hero image
  const active =
    activeIndex !== null
      ? branch.attractions[activeIndex]
      : { image: branch.heroImage, label: "Welcome" };

  // Preload attraction images
  useEffect(() => {
    branch.attractions.forEach((a) => {
      const img = new Image();
      img.src = a.image;
    });
  }, [branch.attractions]);

  // Scroll to next attraction (mobile)
  const nextAttraction = () => {
    setActiveIndex((prev) => {
      const nextIndex =
        prev === null ? 0 : (prev + 1) % branch.attractions.length;
      if (listRef.current) {
        const container = listRef.current;
        const card = container.children[nextIndex] as HTMLElement;
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
      return nextIndex;
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden text-white">
      {/* Hero Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.35), rgba(10,10,10,0.45)), url(${active?.image})`,
          }}
        />
      </AnimatePresence>

      {/* Hero Text Container */}
      <div className="relative z-20 max-w-7xl mx-auto mt-32 px-6 h-full flex flex-col justify-start">
        <div className="max-w-xl">
          {/* Welcome Heading */}
          <motion.h1
            className="text-2xl mt-4 md:text-4xl font-extrabold leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Haile Resorts
            <span className="block text-5xl font-extrabold text-primary/40 md:text-7xl mt-2">
              {branch.branchName}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-4 text-lg md:text-xl max-w-xl text-gray-200/90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {branch.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-6 flex gap-4 items-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <button className="rounded-full px-5 py-3 bg-white/10 border border-white/20 text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition">
              Check Availability
            </button>
          </motion.div>

          {/* Contact Card (priority, always shows) */}
          <motion.div
            className="mt-6 px-6 py-4 rounded-2xl bg-primar/20 border-primary/50 text-text max-w-fit border border-white/20 shadow-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <p className="text-lg font-bold tracking-wide mb-2">Contact Us</p>

            {/* Phone */}
            {branch?.contact?.phone ? (
              <p className="text-sm font-semibold">{branch.contact.phone}</p>
            ) : (
              <p className="text-sm text-gray-300 italic">
                Phone not available
              </p>
            )}

            {/* Email */}
            {branch?.contact?.email ? (
              <a
                href={`mailto:${branch.contact.email}`}
                className="block text-sm mt-1 hover:underline"
              >
                {branch.contact.email}
              </a>
            ) : (
              <p className="text-sm text-gray-300 italic">
                Email not available
              </p>
            )}

            {/* Directions */}
            {branch?.directionsUrl && (
              <a
                href={branch.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded-full px-5 py-2 bg-primary/80 text-sm font-medium hover:scale-105 transition-transform"
              >
                Directions
              </a>
            )}
          </motion.div>

          {/* Current Attraction Label */}
          <motion.div
            className="mt-6 text-2xl md:text-3xl font-bold drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {active.label}
          </motion.div>
        </div>

        {/* Attractions Horizontal Scroll */}
        {branch.attractions.length > 0 && (
          <div className="absolute top-[60vh] left-0 w-full overflow-hidden">
            <div
              ref={listRef}
              className="flex gap-4 px-4 overflow-x-auto scroll-smooth scrollbar-hide md:overflow-visible md:justify-end"
            >
              {branch.attractions.map((att, i) => (
                <button
                  key={att.id}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex-shrink-0 w-44 h-32 md:w-56 md:h-40 rounded-2xl overflow-hidden backdrop-blur-md bg-white/6 border border-white/10 shadow-xl focus:outline-none transition-all ${
                    i === activeIndex
                      ? "ring-2 ring-amber-300/40 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${att.image})`,
                      filter: "contrast(0.9) brightness(0.8)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute left-4 bottom-3 text-left text-white">
                    <div className="text-sm md:text-base font-semibold tracking-tight">
                      {att.label}
                    </div>
                    <div className="text-xs text-gray-200/70">Attraction</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Next Button */}
        <div className="md:hidden absolute bottom-40 left-1/2 -translate-x-1/2 flex items-center">
          <button
            onClick={nextAttraction}
            className="px-4 py-2 rounded-full bg-amber-600 shadow-lg text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
