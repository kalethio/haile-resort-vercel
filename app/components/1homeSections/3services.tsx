"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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
    title: "Nature's Escape & Scenic Views",
    description:
      "Unwind amidst breathtaking landscapes and immerse yourself in the serenity of nature",
    video: "0dZiTd9hcGs",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeService = SERVICES[activeIndex];

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextService = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % SERVICES.length),
    []
  );

  const prevService = useCallback(
    () =>
      setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length),
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevService();
      if (e.key === "ArrowRight") nextService();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevService, nextService]);

  // Mobile video URL with different parameters
  const videoUrl = isMobile
    ? `https://www.youtube-nocookie.com/embed/${activeService.video}?autoplay=1&mute=1&playsinline=1&rel=0&controls=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed/${activeService.video}?autoplay=1&mute=1&loop=1&playlist=${activeService.video}&controls=0&modestbranding=1&rel=0`;

  return (
    <section className="w-full min-h-screen md:min-h-[90vh] flex flex-col px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header - Responsive padding */}
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 lg:pb-12 tracking-tight text-primary px-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Experience the Haile Difference
      </motion.h2>

      {/* Main Container */}
      <motion.div
        className="flex-1 flex flex-col lg:flex-row bg-background rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-gray-100 mx-auto w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Video Section */}
        <div className="lg:w-3/4 xl:w-4/5 h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-full relative">
          {/* Video Container with proper aspect ratio */}
          <div className="relative w-full h-full bg-black">
            <iframe
              src={videoUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              title={activeService.title}
              loading="lazy"
              playsInline={isMobile}
            />
          </div>

          {/* Mobile Navigation Overlay */}
          <div className="lg:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-6 px-4">
            <div className="flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center px-4"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {activeService.title}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {activeService.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={prevService}
                  className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all active:scale-95"
                  aria-label="Previous service"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

                {/* Mobile Dots Indicator */}
                <div className="flex gap-2">
                  {SERVICES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activeIndex
                          ? "bg-white scale-125"
                          : "bg-white/40"
                      }`}
                      aria-label={`Go to service ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextService}
                  className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all active:scale-95"
                  aria-label="Next service"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Side Panel */}
        <div className="hidden lg:flex lg:w-1/4 xl:w-1/5 h-full">
          <div className="w-full h-full flex flex-col p-4 lg:p-6">
            {/* Active Service Card */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-primary/10 p-4 lg:p-6 mb-4 lg:mb-6"
                >
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 lg:mb-3">
                    {activeService.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                    {activeService.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Service List */}
            <div className="space-y-2 lg:space-y-3">
              {SERVICES.map((service, index) => (
                <motion.button
                  key={service.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-200 ${
                    index === activeIndex
                      ? "bg-primary/10 border border-primary/20 shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium ${
                      index === activeIndex ? "text-primary" : "text-gray-700"
                    }`}
                  >
                    {service.title}
                  </h4>
                </motion.button>
              ))}
            </div>

            {/* Desktop Navigation */}
            <div className="flex justify-between mt-4 lg:mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={prevService}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="text-xs text-gray-400">
                {activeIndex + 1} / {SERVICES.length}
              </div>
              <button
                onClick={nextService}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                aria-label="Next service"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
