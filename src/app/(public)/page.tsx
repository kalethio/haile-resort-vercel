"use client";

import { motion } from "framer-motion";

import HeroSection from "../components/1homeSections/1herosection";
import DestinationSection from "../components/1homeSections/2destinations";
import ServicesSection from "../components/1homeSections/3services";
import FavPackageSection from "../components/1homeSections/4favPackage";
import TestimonialSection from "../components/1homeSections/5testimonial";
import LatestNewsSection from "../components/1homeSections/6latestNews";
import SubscribeSection from "../components/1homeSections/7subscribe";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div>
      {/* Hero - simple entrance animation (no scroll trigger) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      {/* Scroll reveal sections */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <DestinationSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <ServicesSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <FavPackageSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <TestimonialSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <LatestNewsSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        variants={fadeInUp}
      >
        <SubscribeSection />
      </motion.div>
    </div>
  );
}
