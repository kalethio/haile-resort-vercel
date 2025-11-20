// app/about/Hero.tsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { heroData } from "./data";

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="relative h-[30vh]">
        {/* Background Image */}
        <Image
          src={heroData.image}
          alt="About hero image"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-primary/5" />

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-screen text-primary text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
          >
            {heroData.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-primary/80 max-w-3xl"
          >
            {heroData.sub}
          </motion.p>
        </div>
      </div>
    </header>
  );
}
