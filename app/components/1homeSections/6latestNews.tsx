"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NewsItem = {
  title: string;
  desc: string;
  detail: string;
};

export default function LatestNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<number | null>(null);

  // Fetch news from API on component load
  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Failed to load news:", err));
  }, []);

  return (
    <section id="news" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-primary mb-10 md:mb-14">
          Latest News & Events
        </h2>

        {/* Mobile: horizontal scroll; Desktop: grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative min-h-[220px] md:min-h-[260px] p-6 md:p-10 rounded-2xl shadow-md border border-gray-100 h-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5 snap-start md:snap-none flex-shrink-0 md:flex-shrink-auto w-[80%] md:w-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.2,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary rounded-t-2xl" />

              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-primary/70">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-grow">
                {item.desc}
              </p>

              <span
                onClick={() => setSelectedNews(idx)}
                className="mt-4 md:mt-6 inline-block text-primary text-sm font-medium tracking-wide hover:underline cursor-pointer"
              >
                Read More →
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedNews !== null && news[selectedNews] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 md:p-10 mx-4 md:mx-0 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                {news[selectedNews].title}
              </h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {news[selectedNews].detail}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
