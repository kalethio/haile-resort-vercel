"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

/* =======================
   Types
======================= */
interface Attraction {
  id: number;
  label: string;
  description?: string;
  order: number;
}

interface AttractionsSectionProps {
  attractions: Attraction[];
  description?: string;
  branchName: string;
}

/* =======================
   Animation Variants
======================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* =======================
   Component
======================= */
export default function AttractionsSection({
  attractions,
  description,
  branchName,
}: AttractionsSectionProps) {
  // Stable, memoized sort (no mutation, no duplication risk)
  const sortedAttractions = useMemo(
    () => [...attractions].sort((a, b) => a.order - b.order),
    [attractions]
  );

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* =======================
              Left: Text
          ======================= */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full w-fit">
              Discover
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Attractions at {branchName}
            </h2>

            <p className="text-lg leading-relaxed text-gray-600 max-w-xl">
              {description ??
                "Experience the highlights that make this location special — from natural beauty to cultural charm and unforgettable moments."}
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </motion.div>

          {/* =======================
              Right: Cards
          ======================= */}
          {sortedAttractions.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
            >
              {sortedAttractions.map((attraction, index) => (
                <motion.article
                  key={attraction.id}
                  variants={itemVariants}
                  tabIndex={0}
                  aria-label={`Attraction: ${attraction.label}`}
                  className="group relative bg-white rounded-xl border border-gray-100 p-6 shadow-md hover:shadow-xl focus:shadow-xl transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {/* Index */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-10">
                    {attraction.label}
                  </h3>

                  {attraction.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {attraction.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <span className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                      Explore more
                    </span>
                    <FiArrowRight className="transition-transform group-hover:translate-x-1 group-focus:translate-x-1" />
                  </div>

                  {/* Accent bar */}
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500 rounded-b-xl" />
                </motion.article>
              ))}
            </motion.div>
          ) : (
            /* =======================
                Empty State
            ======================= */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiArrowRight className="text-2xl text-gray-400 rotate-45" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No attractions yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Attractions will appear here once they are added.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
