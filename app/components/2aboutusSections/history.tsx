// app/about/HistorySection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { historyData, brand } from "./data";

export function HistorySection() {
  return (
    <section className="py-16 sm:py-20 text-primary bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-semibold text-[var(--hhr-burgundy)] mb-6"
          style={{ fontFamily: brand.fonts.heading }}
        >
          {historyData.heading}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-700 mb-8 text-lg leading-relaxed"
        >
          {historyData.lead}
        </motion.p>

        <div className="grid gap-8 mb-12">
          {historyData.paragraphs.map((p, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 + 0.2 }}
              className="text-gray-700 leading-relaxed text-base"
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Image with Side Entrance Animation */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="mt-12 sm:mt-16"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/about/statements.jpg"
              alt="Mission Statements and Company Values"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AASkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
