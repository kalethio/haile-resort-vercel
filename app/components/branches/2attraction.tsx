"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

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
  // 1. DEFENSIVE: Always ensure array, remove duplicates, sort
  const processedAttractions = React.useMemo(() => {
    if (!attractions || !Array.isArray(attractions)) return [];

    // Remove duplicates by multiple criteria
    const seen = new Set();
    const unique = attractions.filter((attraction) => {
      // Check both ID and label to catch different duplicates
      const key = `${attraction.id}-${attraction.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by order
    return unique.sort((a, b) => a.order - b.order);
  }, [attractions]);

  // 2. Debug log to see what's happening
  React.useEffect(() => {
    console.log("AttractionsSection:", {
      input: attractions?.length,
      output: processedAttractions.length,
      inputIds: attractions?.map((a) => a.id),
      outputIds: processedAttractions.map((a) => a.id),
    });
  }, [attractions, processedAttractions]);

  // 3. Return COMPLETELY different layout that can't duplicate
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Single column layout */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover {branchName}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description || "Unique experiences await you"}
          </p>
        </div>

        {/* SINGLE COLUMN LIST - Impossible to duplicate visually */}
        <div className="max-w-3xl mx-auto space-y-4">
          {processedAttractions.map((attraction) => (
            <motion.div
              key={`attraction-${attraction.id}-${attraction.label}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {attraction.order}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {attraction.label}
                  </h3>
                  {attraction.description && (
                    <p className="text-gray-600">{attraction.description}</p>
                  )}
                </div>
                <FiArrowRight className="text-gray-400 text-xl" />
              </div>
            </motion.div>
          ))}

          {/* If empty, show a clear message */}
          {processedAttractions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No attractions to display</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
