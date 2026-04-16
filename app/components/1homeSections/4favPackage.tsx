"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PACKAGES, Package } from "../../data/favPackages";
import BookingForm from "../bookingform";

const serviceDescription = (
  <>
    All-in-one service built by <strong>“ይቻላል”</strong> <br />
    <em>(It is possible)</em>
  </>
);

export default function HaileFavouritePackages() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const globalOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, 0.95]
  );

  const bottomSpacerVH = Math.max(5, PACKAGES.length * 2);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-20"
      aria-labelledby="haile-packages-title"
    >
      {/* Section heading */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 mt-20 bg-gradient-to-t from-primary/5 to-bg">
        <h2
          id="haile-packages-title"
          className="text-3xl text-primary pt-4 md:text-4xl lg:text-5xl font-serif font-light text-center tracking-tight"
        >
          {serviceDescription}
        </h2>
      </div>

      {/* Desktop Version: scroll takeover */}
      <div className="hidden md:block">
        <div className="h-[10vh]" />

        <motion.div
          style={{ opacity: globalOpacity }}
          className="pointer-events-none sticky top-0 left-0 right-0 z-30 flex items-center justify-center"
        >
          <div className="max-w-6xl mx-auto w-full px-6 md:px-12 lg:px-20">
            <div className="space-y-28">
              {PACKAGES.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={index}
                  onBookNow={() => setIsBookingOpen(true)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <div style={{ height: `${bottomSpacerVH}vh` }} />
      </div>

      {/* Mobile Version: stacked cards with expand/collapse */}
      <div className="md:hidden max-w-3xl mx-auto px-4 space-y-6">
        {PACKAGES.map((pkg) => (
          <MobilePackageCard
            key={pkg.id}
            pkg={pkg}
            onBookNow={() => setIsBookingOpen(true)}
          />
        ))}
      </div>

      {/* Booking Form Popup */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBookingOpen(false)}
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

function PackageCard({
  pkg,
  index,
  onBookNow,
}: {
  pkg: Package;
  index: number;
  onBookNow: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [0.95, 1.08, 1.2]
  );
  const cardY = useTransform(scrollYProgress, [0, 0.4, 1], [50, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0, 1, 1]);

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
                sizes="(max-width: 768px) 100vw, 50vw"
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
            <button
              onClick={onBookNow}
              className="inline-block mt-5 w-fit rounded-lg px-8 py-3 text-sm font-semibold bg-primary/90 text-white shadow-md hover:bg-primary transition"
            >
              {pkg.ctaLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MobilePackageCard({
  pkg,
  onBookNow,
}: {
  pkg: Package;
  onBookNow: () => void;
}) {
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
          <button
            onClick={onBookNow}
            className="inline-block rounded-lg px-6 py-2 text-xs font-semibold bg-black text-white shadow-md hover:bg-primary transition"
          >
            {pkg.ctaLabel}
          </button>
        )}
      </motion.div>
    </div>
  );
}
