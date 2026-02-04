"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

// Types
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

export default function AttractionsSection({
  attractions,
  description,
  branchName,
}: AttractionsSectionProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Fix: Remove duplicates by id, then sort
  const uniqueAttractions = Array.from(
    new Map(attractions.map((item) => [item.id, item])).values()
  );

  const sortedAttractions = [...uniqueAttractions].sort(
    (a, b) => a.order - b.order
  );

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout - Updated spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column - Simplified */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide text-gray-600 uppercase bg-gray-100 rounded-full mb-3">
                Discover {branchName}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Attractions
              </h2>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {description ||
                  "Experience the unique charm and distinctive features that make our location special."}
              </p>
            </div>

            {/* Minimal divider */}
            <div className="pt-2">
              <div className="w-16 h-0.5 bg-gray-300"></div>
            </div>
          </motion.div>

          {/* Right Column - Cleaner grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {sortedAttractions.map((attraction, index) => (
              <motion.div
                key={attraction.id}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-sm overflow-hidden">
                  {/* Minimal index indicator */}
                  <div className="absolute top-4 right-4 text-2xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 pr-8 mb-2">
                      {attraction.label}
                    </h3>

                    {attraction.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
                        {attraction.description}
                      </p>
                    )}

                    {/* Subtle CTA */}
                    <div className="flex items-center text-gray-400 text-sm">
                      <span>Learn more</span>
                      <FiArrowRight className="ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Thin hover indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-gray-900 transition-colors duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Empty State - Simplified */}
        {sortedAttractions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 text-center py-10"
          >
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <FiArrowRight className="text-xl text-gray-400 rotate-45" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No attractions listed
              </h3>
              <p className="text-gray-400 text-sm">
                Check back soon for updates.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
