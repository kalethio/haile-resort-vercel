"use client";

import { motion } from "framer-motion";
import HeroSection from "../components/1homeSections/1herosection";
import DestinationSection from "../components/1homeSections/2destinations";
import ServicesSection from "../components/1homeSections/3services";
import FavPackageSection from "../components/1homeSections/4favPackage";
import SubscribeSection from "../components/1homeSections/7subscribe";

export default function Home() {
  return (
    <div className="max-w-screen overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      <DestinationSection />
      <FavPackageSection />
      <ServicesSection />
      <SubscribeSection />
    </div>
  );
}
