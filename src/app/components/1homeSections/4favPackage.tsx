"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// --------------------------------------
// Package type definition
// --------------------------------------
type Package = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel?: string;
};

// --------------------------------------
// Section heading description (rich JSX)
// --------------------------------------
const serviceDescription = (
  <>
    All-in-one service built by <strong>“ይቻላል”</strong> <br />
    <em>(It is possible)</em>
  </>
);

// --------------------------------------
// Static package data
// --------------------------------------
const PACKAGES: Package[] = [
  {
    id: "family",
    title: "Family Vacation",
    subtitle: "Unforgettable Moments Together",
    description: `Create lasting memories with your loved ones at Haile Hotels. Our family-friendly amenities, spacious rooms, and curated activities ensure fun and relaxation for all ages.`,
    image: "/images/packages/family.jpg",
    ctaLabel: "View Package",
  },
  {
    id: "romantic",
    title: "Romantic Getaway",
    subtitle: "A Retreat for Two",
    description: `Escape with your special someone to our serene settings. Enjoy candlelit dinners, couples’ spa experiences, and breathtaking views for the perfect romantic retreat.`,
    image: "/images/packages/romantic.jpg",
    ctaLabel: "View Package",
  },
  {
    id: "wellness",
    title: "Wellness Retreat",
    subtitle: "Rejuvenate Your Mind & Body",
    description: `Refresh and recharge with holistic wellness programs. From yoga sessions to spa therapies, our retreat is designed to nurture your body, mind, and soul.`,
    image: "/images/packages/wellness.jpg",
    ctaLabel: "View Package",
  },
  {
    id: "cultural",
    title: "Cultural Discovery",
    subtitle: "Explore Local Heritage",
    description: `Immerse yourself in Ethiopia’s rich culture. Guided tours, local cuisine experiences, and curated workshops make your stay an authentic journey of discovery.`,
    image: "/images/packages/cultural.jpg",
    ctaLabel: "View Package",
  },
  {
    id: "nature",
    title: "Nature Escape",
    subtitle: "Connect with the Outdoors",
    description: `Experience tranquility amidst lush landscapes. Hiking, scenic views, and eco-friendly activities allow you to reconnect with nature in style and comfort.`,
    image: "/images/packages/nature.jpg",
    ctaLabel: "View Package",
  },
];

// --------------------------------------
// Main Component
// --------------------------------------
export default function HaileFavouritePackages() {
  const containerRef = useRef<HTMLElement | null>(null);

  // Track scroll progress within section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Fade out effect as the user scrolls through
  const globalOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, 0.95]
  );

  // Adjust bottom spacer dynamically to fit number of packages
  const bottomSpacerVH = Math.max(30, PACKAGES.length * 10);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-20"
      aria-labelledby="haile-packages-title"
    >
      {/* Section heading */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pt-30 bg-gradient-to-t from-primary/5 to-bg">
        <h2
          id="haile-packages-title"
          className="text-3xl text-primary pt-4 md:text-4xl lg:text-5xl font-serif font-light text-center tracking-tight"
        >
          {serviceDescription}
        </h2>
      </div>

      {/* Desktop Version: scroll takeover */}
      <div className="hidden md:block">
        {/* Spacer before cards start appearing */}
        <div className="h-[10vh]" />

        {/* Sticky container that holds all package cards */}
        <motion.div
          style={{ opacity: globalOpacity }}
          className="pointer-events-none sticky top-0 left-0 right-0 z-30 flex items-center justify-center"
        >
          <div className="max-w-6xl mx-auto w-full px-6 md:px-12 lg:px-20">
            <div className="space-y-28">
              {PACKAGES.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Spacer after cards to allow scrolling through */}
        <div style={{ height: `${bottomSpacerVH}vh` }} />
      </div>

      {/* Mobile Version: stacked cards with expand/collapse */}
      <div className="md:hidden max-w-3xl mx-auto px-4 space-y-6">
        {PACKAGES.map((pkg) => (
          <MobilePackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}

// --------------------------------------
// Desktop Card Component
// --------------------------------------
function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Track scroll for individual card
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Animate image scaling, card Y position, and opacity on scroll
  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [0.98, 1.05, 1.1]
  );
  const cardY = useTransform(scrollYProgress, [0, 0.4, 1], [28, 0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0, 1, 1]);

  // Alternate layout (image left/right) for each card
  const isReversed = index % 2 === 1;

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ y: cardY, opacity }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-10 md:pt-14 pointer-events-auto"
      >
        {/* Image container */}
        <div
          className={`${isReversed ? "order-2 md:order-1" : "order-1"} md:pr-10`}
        >
          <div className="relative h-72 md:h-[480px] w-full overflow-hidden rounded-2xl shadow-xl">
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0"
            >
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Text content */}
        <div
          className={`${
            isReversed ? "order-1 md:order-2 md:pl-10" : "order-2 md:pl-10"
          } flex flex-col justify-center`}
        >
          <h3 className="text-2xl md:text-3xl lg:text-3xl font-serif font-semibold text-gray-800 leading-snug">
            {pkg.title}
          </h3>
          <h4 className="text-base md:text-lg lg:text-xl font-light text-gray-600 mt-1">
            {pkg.subtitle}
          </h4>
          <p className="mt-4 text-base md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl whitespace-pre-line">
            {pkg.description}
          </p>
          {pkg.ctaLabel && (
            <a
              href="#"
              className="inline-block mt-5 rounded-lg px-8 py-3 text-sm font-semibold bg-primary/90 text-white shadow-md hover:bg-primary transition"
            >
              {pkg.ctaLabel}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// --------------------------------------
// Mobile Card Component (expandable)
// --------------------------------------
function MobilePackageCard({ pkg }: { pkg: Package }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="flex flex-col items-center text-center cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg mb-3">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent rounded-2xl" />
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-xl font-serif font-semibold text-gray-800">
        {pkg.title}
      </h3>
      <h4 className="text-sm font-light text-gray-600 mt-0.5">
        {pkg.subtitle}
      </h4>

      {/* Expandable description + CTA */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        className="overflow-hidden mt-2 px-2"
      >
        <p className="text-xs text-gray-700 leading-relaxed mb-2">
          {pkg.description}
        </p>
        {pkg.ctaLabel && (
          <a
            href="#"
            className="inline-block rounded-lg px-6 py-2 text-xs font-semibold bg-black text-white shadow-md hover:bg-primary transition"
          >
            {pkg.ctaLabel}
          </a>
        )}
      </motion.div>
    </div>
  );
}
