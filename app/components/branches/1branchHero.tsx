"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookingForm from "../bookingform";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  // Active attraction or fallback hero image
  const active =
    activeIndex !== null
      ? branch.attractions[activeIndex]
      : { image: branch.heroImage, label: branch.branchName };

  // Preload attraction images with error handling
  useEffect(() => {
    const imagesToPreload = [
      branch.heroImage,
      ...branch.attractions.map((a) => a.image),
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => console.warn(`Failed to load image: ${src}`);
    });
  }, [branch.heroImage, branch.attractions]);

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

  // Contact info with better fallbacks
  const contact = branch.contact || {};
  const hasContactInfo = contact.phone || contact.email;

  return (
    <section className="relative w-full h-screen max-h-screen overflow-hidden text-white">
      {/* Hero Background with loading state */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.5), rgba(10,10,10,0.6)), url(${active?.image})`,
          }}
          aria-label={`Background image: ${active?.label}`}
        />
      </AnimatePresence>

      {/* Loading Fallback */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}

      {/* Hero Text Container - MOBILE ADJUSTMENTS */}
      <div className="relative md:z-20 max-w-7xl mx-auto mt-20 px-4 sm:px-6 h-full flex flex-col justify-start">
        <div className="max-w-xl">
          {/* Welcome Heading - MOBILE FIX */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Haile Resorts
            <span className="block text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary/90 mt-2 sm:mt-3">
              {branch.branchName}
            </span>
          </motion.h1>

          {/* Description - MOBILE FIX */}
          <motion.p
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-xl text-gray-200/95 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {branch.description}
          </motion.p>

          {/* CTA Buttons - MOBILE FIX */}
          <motion.div
            className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 items-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <button
              onClick={() => setShowBookingForm(true)} // ADD THIS ONCLICK
              className="rounded-full px-6 sm:px-8 py-3 sm:py-4 bg-white/10 border border-white/20 text-sm sm:text-base font-medium backdrop-blur-sm hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
              aria-label="Book a room"
            >
              Book Now
            </button>
          </motion.div>

          {/* Contact Card - MOBILE FIX */}
          {hasContactInfo && (
            <motion.div
              className="mt-6 sm:mt-8 px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/30 text-white max-w-fit backdrop-blur-sm shadow-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <p className="text-base sm:text-lg font-bold tracking-wide mb-2 sm:mb-3">
                Contact Us
              </p>

              {/* Phone */}
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="block text-xs sm:text-sm font-semibold hover:text-primary/80 transition-colors"
                  aria-label="Call us"
                >
                  📞{" "}
                  <span className="text-transparent hover:text-primary/80 ">
                    {contact.phone}
                  </span>
                </a>
              ) : (
                <p className="text-xs sm:text-sm text-gray-300 italic">
                  Phone not available
                </p>
              )}

              {/* Email */}
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-xs sm:text-sm mt-1 sm:mt-2 hover:text-primary/80 transition-colors hover:underline"
                  aria-label="Send us an email"
                >
                  ✉️ {contact.email}
                </a>
              ) : (
                <p className="text-xs sm:text-sm text-gray-300 italic mt-1 sm:mt-2">
                  Email not available
                </p>
              )}

              {/* Directions */}
              {branch.directionsUrl && (
                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 sm:mt-4 inline-block rounded-full px-4 sm:px-5 py-1.5 sm:py-2 bg-primary/80 text-xs sm:text-sm font-medium hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Get directions to this branch"
                >
                  📍 Directions
                </a>
              )}
            </motion.div>
          )}

          {/* Current Attraction Label - MOBILE FIX */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.label}
              className="mt-6 sm:mt-8 text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {active.label}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Attractions Horizontal Scroll - LOWERED ON MOBILE */}
        {branch.attractions.length > 0 && (
          <div className="absolute top-[50vh] sm:top-[55vh] md:top-[60vh] left-0 w-full overflow-hidden">
            <div
              ref={listRef}
              className="flex gap-3 sm:gap-4 px-3 sm:px-4 overflow-x-auto scroll-smooth scrollbar-hide md:overflow-visible md:justify-end pb-3 sm:pb-4"
              aria-label="Branch attractions"
            >
              {branch.attractions.map((att, i) => (
                <button
                  key={att.id}
                  onClick={() => setActiveIndex(i)}
                  className={`relative flex-shrink-0 w-36 h-24 sm:w-44 sm:h-32 md:w-56 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-md bg-white/6 border border-white/10 shadow-lg focus:outline-none transition-all duration-300 ${
                    i === activeIndex
                      ? "ring-2 sm:ring-3 ring-primary/60 scale-105"
                      : "hover:scale-105 hover:ring-1 hover:ring-white/30"
                  }`}
                  aria-label={`View ${att.label} attraction`}
                  aria-current={i === activeIndex ? "true" : "false"}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${att.image})`,
                      filter: "contrast(0.9) brightness(0.8)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute left-3 bottom-2 text-left text-white">
                    <div className="text-xs sm:text-sm md:text-base font-semibold tracking-tight">
                      {att.label}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-200/80 mt-0.5">
                      Attraction
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Next Button - IMPROVED */}
        {branch.attractions.length > 0 && (
          <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center">
            <button
              onClick={nextAttraction}
              className="px-4 py-2 rounded-full bg-primary/15 shadow-lg text-xs font-medium hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Next attraction"
            >
              &gt;&gt;
            </button>
          </div>
        )}
      </div>
      {/* Booking Form Popup */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
            <BookingForm />
          </div>
        </div>
      )}
    </section>
  );
}
