"use client";

import { motion } from "framer-motion";

import LatestNewsSection from "@/app/components/1homeSections/6latestNews";

export default function Home() {
  return (
    <div className="max-w-screen m-28 overflow-hidden">
      <LatestNewsSection />
    </div>
  );
}
