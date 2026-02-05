"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

/* =====================
   Types
===================== */
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

/* =====================
   Animations (simple + safe)
===================== */
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

/* =====================
   Component
===================== */
export default function AttractionsSection({
  attractions,
  description,
  branchName,
}: AttractionsSectionProps) {
  /**
   * HARD GUARANTEE:
   * - No duplicates
   * - Stable order
   * - Immune to double fetch / double render / bad parents
   */
  const safeAttractions = useMemo(() => {
    const map = new Map<number, Attraction>();

    for (const attraction of attractions) {
      map.set(attraction.id, attraction); // last one wins
    }

    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [attractions]);

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
            Discover
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Attractions at {branchName}
          </h2>

          <p className="text-gray-600 text-lg">
            {description ??
              "Explore the standout experiences and highlights that make this destination special."}
          </p>
        </div>

        {/* Content */}
        {safeAttractions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FiArrowRight className="text-gray-400 rotate-45" />
            </div>
            <p className="text-gray-500">No attractions available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeAttractions.map((attraction, index) => (
              <motion.div
                key={attraction.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Index */}
                <div className="text-sm font-semibold text-primary/60 mb-2">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {attraction.label}
                </h3>

                {attraction.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {attraction.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Explore</span>
                  <FiArrowRight />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
