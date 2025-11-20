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
      transition: { staggerChildren: 0.1 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-50/50 to-white"
      aria-labelledby="ceo-message-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start"
        >
          {/* Portrait column */}
          <motion.div
            variants={imageVariants}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-lg border border-white/30 bg-white">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={ceoData.portrait}
                  alt={`${ceoData.name} portrait`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZ..."
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content column */}
          <motion.div variants={textVariants} className="flex items-start">
            <div className="w-full h-full">
              <div className="bg-white/90 text-accent backdrop-blur-sm rounded-xl p-5 sm:p-6 lg:p-7 shadow-lg border border-white/40 h-full flex flex-col">
                <h2
                  id="ceo-message-heading"
                  className="font-bold mb-3"
                  style={{
                    fontFamily: brand.fonts.heading,
                    fontSize: "clamp(1.25rem, 2.2vw, 2rem)",
                    color: "var(--hhr-burgundy)",
                    lineHeight: 1.1,
                  }}
                >
                  Message from Major Haile Gebrselassie
                </h2>

                <div
                  className="italic text-sm sm:text-base mb-4 border-l-3 border-[var(--hhr-lemon)] pl-3 text-[var(--hhr-burgundy)]"
                  style={{ maxWidth: "70ch" }}
                >
                  {ceoData.greetingAmharic}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-3 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-2">
                    {ceoData.letter.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className="leading-relaxed text-[0.92rem] sm:text-[0.95rem] max-w-[70ch]"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 pt-4 border-t border-gray-200/60"
                >
                  <div className="font-bold text-base text-[var(--hhr-burgundy)]">
                    {ceoData.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
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
