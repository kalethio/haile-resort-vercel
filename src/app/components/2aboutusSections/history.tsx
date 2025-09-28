// app/about/HistorySection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { historyData, brand } from "./data";

export function HistorySection() {
  return (
    <section className="py-12 sm:py-16 text-primary bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h3
          className="text-2xl md:text-3xl font-semibold text-[var(--hhr-burgundy)] mb-4"
          style={{ fontFamily: brand.fonts.heading }}
        >
          {historyData.heading}
        </h3>
        <p className="text-gray-700 mb-6">{historyData.lead}</p>

        <div className="grid gap-6">
          {historyData.paragraphs.map((p, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-700"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
