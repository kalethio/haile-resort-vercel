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

export const DATA = {
  headline: "EXPERIENCE ETHIOPIA THE HAILE WAY",
  subheadline: "Hospitality redefined across Ethiopia's finest destinations.",
  services: [
    {
      title: "Scenic Destinations",
      image: "/images/main-hero/hero1.jpg",
      alt: "Beautiful landscape view of Ethiopian highlands at Haile Resorts",
    },
    {
      title: "Luxurious treats",
      image: "/images/main-hero/hero2.jpg",
      alt: "Luxurious room interior and amenities at Haile Resorts",
    },
    {
      title: "Lakeside Adventures",
      image: "/images/main-hero/hero3.jpg",
      alt: "Serene lake view and water activities at Haile Resorts",
    },
    {
      title: "Nature Within Reach",
      image: "/images/main-hero/hero4.jpg",
      alt: "Natural surroundings and wildlife experiences at Haile Resorts",
    },
  ],
  autoAdvanceMs: 7000,
};

type Service = (typeof DATA)["services"][number];

export default function HeroHybridCarousel() {
  const { headline, services, autoAdvanceMs } = DATA;
  const [index, setIndex] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBranches(data);
      setError(null);
    } catch (err) {
      setError("Unable to load destinations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchBranches(), 2000); // 2s delay
    return () => clearTimeout(timer);
  }, []);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 100]);
  const headlineY = useTransform(scrollY, [0, 500], [0, 200]);

  // ✅ FIX: delay carousel start (no UI impact)
  useEffect(() => {
    const delay = setTimeout(() => {
      const t = setInterval(
        () => setIndex((i) => (i + 1) % services.length),
        autoAdvanceMs
      );
      return () => clearInterval(t);
    }, 4000);

    return () => clearTimeout(delay);
  }, [services.length, autoAdvanceMs]);

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
                alt={s.alt}
                fill
                priority={i === 0} // ✅ FIX 1
                loading={i === 0 ? "eager" : "lazy"} // ✅ FIX 1
                quality={75}
                sizes="100vw"
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-black/30 to-transparent" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      <div className="relative z-20 mt-16 md:mt-32 h-full max-h-[80vh] flex flex-col justify-between py-8 pb-32 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-full sm:max-w-xl lg:w-3/5 lg:max-w-2xl mt-8 lg:mt-0">
          <motion.h1
            className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-2xl tracking-tight"
            style={{ y: headlineY }}
          >
            {headline}
          </motion.h1>

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

        {/* ✅ FIX 2: prevent layout shift */}
        <div style={{ minHeight: "120px" }}>
          <CheckBooking />
        </div>
      </div>
    </section>
  );
}
