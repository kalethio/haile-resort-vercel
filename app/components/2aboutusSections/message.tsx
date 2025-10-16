// app/about/CEOMessage.tsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ceoData, brand } from "./data";

export function CEOMessage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.52, ease: "easeOut" },
    },
  };

  return (
    <section
      className="py-10 sm:py-14 lg:py-18 bg-gradient-to-b from-gray-50/50 to-white"
      aria-labelledby="ceo-message-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch"
        >
          {/* Portrait column - becomes row 1 on small screens */}
          <motion.div
            variants={imageVariants}
            className="order-1 lg:order-1 flex items-center justify-center"
          >
            {/* Flex child stretches to match text column height */}
            <div className="w-full flex-1 max-w-md sm:max-w-lg lg:max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/30 bg-gradient-to-br from-white/60 to-white/20">
              {/* Constrain the image height to avoid any internal scrolling */}
              <div className="relative w-full max-h-[72vh] sm:max-h-[56vh] lg:max-h-[64vh] overflow-hidden">
                {/* Use intrinsic size to avoid fill-based layout jumps and prevent scroll */}
                <Image
                  src={ceoData.portrait}
                  alt={`${ceoData.name} portrait`}
                  width={720} // intrinsic width
                  height={960} // intrinsic height (approx 3/4)
                  className="object-cover w-full h-auto block"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 35vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZ..."
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content column */}
          <motion.div
            variants={textVariants}
            className="order-2 lg:order-2 flex items-center"
          >
            <div className="w-full">
              <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/40">
                <h2
                  id="ceo-message-heading"
                  className="font-bold mb-4"
                  style={{
                    fontFamily: brand.fonts.heading,
                    // fluid heading via clamp for improved responsiveness
                    fontSize: "clamp(1.35rem, 2.6vw, 2.35rem)",
                    color: "var(--hhr-burgundy)",
                    lineHeight: 1.05,
                  }}
                >
                  Message from Major Haile Gebrselassie
                </h2>

                <div
                  className="italic text-base sm:text-lg mb-6 border-l-4 border-[var(--hhr-lemon)] pl-4 text-[var(--hhr-burgundy)]"
                  style={{ maxWidth: "70ch" }}
                >
                  {ceoData.greetingAmharic}
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
                  {ceoData.letter.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 + 0.3 }}
                      className="leading-relaxed text-[0.98rem] sm:text-[1rem] max-w-[70ch]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                  className="mt-8 pt-6 border-t border-gray-200/60 text-right"
                >
                  <div className="font-bold text-lg text-[var(--hhr-burgundy)]">
                    {ceoData.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {ceoData.title}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
