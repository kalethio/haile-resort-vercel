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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -5, transition: { duration: 0.2 } },
  };

  // Sort attractions by order
  const sortedAttractions = [...attractions].sort((a, b) => a.order - b.order);

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full mb-4">
                Discover
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 py-4">
                Attractions
              </h2>
            </div>

            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="text-lg leading-relaxed">
                {description ||
                  "Experience the unique charm and distinctive features that make our location special. From natural wonders to cultural highlights, discover what awaits you."}
              </p>
            </div>

            {/* Decorative Element */}
            <div className="pt-6">
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full"></div>
            </div>
          </motion.div>

          {/* Right Column - Attractions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
          >
            {sortedAttractions.map((attraction, index) => (
              <motion.div
                key={attraction.id}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                className="group relative"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="relative bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform duration-500"></div>

                  {/* Index Number */}
                  <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 pr-10">
                      {attraction.label}
                    </h3>

                    {attraction.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {attraction.description}
                      </p>
                    )}

                    {/* Hover Arrow */}
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore more
                      </span>
                      <FiArrowRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500"></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Empty State */}
        {attractions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <FiArrowRight className="text-3xl text-gray-400 rotate-45" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No attractions listed yet
              </h3>
              <p className="text-gray-500">
                Check back soon for updates on local attractions and
                experiences.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
