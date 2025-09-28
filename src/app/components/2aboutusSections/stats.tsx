// app/about/StatsGrid.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { statsData, brand } from "./data";

export function StatsGrid() {
  return (
    <section className="py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {statsData.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-4 rounded-xl text-primary bg-white/70 backdrop-blur border border-white/30 text-center shadow-sm"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-[var(--hhr-burgundy)]">
                {s.value}
              </div>
              <div className="mt-1 text-md font-medium text-gray-600">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
