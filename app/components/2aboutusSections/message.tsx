// app/about/CEOMessage.tsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ceoData, brand } from "./data";

export function CEOMessage() {
  return (
    <section className="py-8 sm:py-12 text-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Portrait - mobile first */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-tr from-white/60 to-white/20 border border-white/30 order-1 md:order-2"
        >
          <div className="relative h-[50vh] md:h-[80vh]">
            <Image
              src={ceoData.portrait}
              alt={`${ceoData.name} portrait`}
              fill
              className="object-cover"
            />
          </div>
        </motion.figure>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-white/40 order-2 md:order-1"
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--hhr-burgundy)] mb-3"
            style={{ fontFamily: brand.fonts.heading }}
          >
            Message from Major Haile Gebrselassie
          </h2>
          <div className="italic text-sm sm:text-[15px] text-[var(--hhr-burgundy)] mb-4">
            {ceoData.greetingAmharic}
          </div>

          <div className="prose max-w-none text-gray-700 text-sm sm:text-base space-y-3">
            {ceoData.letter.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 text-right">
            <div className="font-semibold text-[var(--hhr-burgundy)]">
              {ceoData.name}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {ceoData.title}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
