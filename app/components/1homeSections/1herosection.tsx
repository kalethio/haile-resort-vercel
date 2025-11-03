"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import CheckBooking from "@/app/(public)/booking/components/checkbooking";
import Link from "next/link";

// Types for API data
interface Branch {
  slug: string;
  branchName: string;
  heroImage: string;
  starRating: number;
  location: {
    city: string;
    region: string;
  };
}

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
  autoAdvanceMs: 7000,
};

type Service = (typeof DATA)["services"][number];

export default function HeroHybridCarousel() {
  const { headline, subheadline, services, autoAdvanceMs } = DATA;
  const [index, setIndex] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch branches from API with caching
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Check cache first (lasts for page session)
        const cached = sessionStorage.getItem("branches");
        if (cached) {
          setBranches(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await fetch("/api/branches");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setBranches(data);
        // Cache for 5 minutes
        sessionStorage.setItem("branches", JSON.stringify(data));
        setError(null);
      } catch (err) {
        setError("Unable to load destinations");
        console.error("Failed to fetch branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Scroll-based parallax effects
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 100]);
  const headlineY = useTransform(scrollY, [0, 500], [0, 200]);
  const subheadlineY = useTransform(scrollY, [0, 500], [0, 300]);

  // Auto-advance service carousel
  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % services.length),
      autoAdvanceMs
    );
    return () => clearInterval(t);
  }, [services.length, autoAdvanceMs]);

  // Memoized branch ticker items for performance
  const branchTickerItems = useMemo(() => {
    if (!branches.length) return [];

    const renderStars = (rating: number) => {
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    return [...branches, ...branches].map((branch, i) => (
      <Link
        key={`${branch.slug}-${i}`}
        href={`/branches/${branch.slug}`}
        className="flex flex-col items-center hover:text-primary transition-colors cursor-pointer text-white/70 hover:text-white min-w-max"
      >
        <span className="font-semibold text-center">{branch.branchName}</span>
        <span className="text-secondary text-sm mt-1">
          {renderStars(branch.starRating)}
        </span>
      </Link>
    ));
  }, [branches]);

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
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ y: bgY }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority
                sizes="100vw"
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
            className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl tracking-tight"
            style={{ y: headlineY }}
          >
            {headline}
          </motion.h1>

          {/* Subheadline
          <motion.p
            className="mt-4 sm:mt-6 max-w-full sm:max-w-lg text-base sm:text-lg text-white/90 leading-relaxed"
            style={{ y: subheadlineY }}
          >
            {subheadline}
          </motion.p> */}

          {/* Booking Form */}

          <CheckBooking />

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
              <h2 className="text-lg sm:text-2xl font-bold text-bg drop-shadow">
                {services[index].title}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Branch ticker with loading and error states */}
          <div className="mt-6 sm:mt-10 overflow-hidden">
            {loading && (
              <div className="flex gap-8 sm:gap-12 py-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center min-w-max">
                    <div className="h-4 bg-white/20 rounded w-16 animate-pulse" />
                    <div className="h-3 bg-white/20 rounded w-12 mt-1 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-2 text-white/60 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && branchTickerItems.length > 0 && (
              <motion.div
                className="flex gap-8 sm:gap-12 py-2 text-xs sm:text-base uppercase tracking-wider whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                {branchTickerItems}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
