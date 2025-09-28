"use client";

import { motion } from "framer-motion";

export default function LatestNews() {
  const news = [
    {
      title: "Grand Opening: Bahir Dar",
      desc: "Celebrate the launch of our newest resort on the shores of Lake Tana.",
    },
    {
      title: "Summer Luxury Packages",
      desc: "Exclusive offers for your summer getaway at any of our seven locations.",
    },
    {
      title: "Conference Expo 2025",
      desc: "Join industry leaders in one of our 35 state-of-the-art conference halls this August.",
    },
  ];

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
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary rounded-t-2xl" />

              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-primary/70">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-grow">
                {item.desc}
              </p>

              <span className="mt-4 md:mt-6 inline-block text-primary text-sm font-medium tracking-wide hover:underline cursor-pointer">
                Read More →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
