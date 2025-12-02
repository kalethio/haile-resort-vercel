"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react"; // Added useCallback import
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SERVICES = [
  {
    title: "Welcome to Haile Grand Addis Ababa",
    description:
      "where luxury meets the heartbeat of the city. Your unforgettable Ethiopian escape starts here",
    video: "iCS0YIJx3Ek",
  },
  {
    title: "Farm to Table Experience",
    description:
      "Straight from our garden to your fork: Watch us pick, wash, and whip up those crisp salads and fresh herbs into something delicious. Real food, real fresh—enjoy the magic",
    video: "5j6QwqWHiNA",
  },
  {
    title: "Wellness & Recreation",
    description:
      "Relax, recharge, and play—our spas, gyms, and outdoor activities are designed for every guest.",
    video: "OvNccfVK0N4",
  },
  {
    title: "Nature’s Escape & Scenic Views",
    description:
      "Unwind amidst breathtaking landscapes and immerse yourself in the serenity of nature",
    video: "0dZiTd9hcGs",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = SERVICES[activeIndex];

  // Wrap nextService in useCallback
  const nextService = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % SERVICES.length),
    []
  );

  // Wrap prevService in useCallback
  const prevService = useCallback(
    () =>
      setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length),
    []
  );

  // Add type for 'e' parameter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevService();
      if (e.key === "ArrowRight") nextService();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevService, nextService]);

  return (
    <section className="w-screen md:w-[80vw] mx-auto h-screen md:max-h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center pt-20 pb-12 tracking-tight text-primary"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Experience the Haile Difference
      </motion.h2>

      {/* Main Container - ONLY ADDED THIS ANIMATION */}
      <motion.div
        className="flex-1 flex flex-col lg:flex-row bg-background mt-8 lg:mt-12"
        initial={{ scale: 0.1, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 2.2,
          scale: {
            type: "spring",
            stiffness: 80,
            damping: 10,
          },
        }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {/* Video Section */}
        <div className="lg:w-4/5 h-[70vh] lg:h-full relative">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeService.video}?autoplay=1&mute=1&loop=1&playlist=${activeService.video}&controls=0&modestbranding=1&rel=0`}
            className="w-full h-full pointer-events-none"
            allow="autoplay"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            title=""
          />

          {/* Mobile Overlay */}
          <div className="lg:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prevService}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-center"
                >
                  <h3 className="text-lg font-medium text-white">
                    {activeService.title}
                  </h3>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={nextService}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Side Panel */}
        <div className="hidden lg:flex w-1/5 h-full">
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="w-full max-w-xs space-y-6">
              {/* Active Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 rounded-2xl bg-white shadow-xl border border-primary/10 space-y-3"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    {activeService.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activeService.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* List */}
              <div className="space-y-1">
                {SERVICES.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.06 },
                    }}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveIndex(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      index === activeIndex
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <h4
                      className={`text-sm font-medium ${
                        index === activeIndex ? "text-primary" : "text-gray-700"
                      }`}
                    >
                      {service.title}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
