"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Branch data
const BRANCHES = [
  {
    slug: "addis",
    name: "Addis Ababa",
    short: "AA",
    image: "/images/branches/addis.jpg",
  },
  {
    slug: "hawassa",
    name: "Hawassa",
    short: "HW",
    image: "/images/branches/hawassa.jpg",
  },
  {
    slug: "jimma",
    name: "Jimma",
    short: "JM",
    image: "/images/branches/jimma.jpg",
  },
  {
    slug: "shashemene",
    name: "Shashemene",
    short: "SH",
    image: "/images/branches/shashemene.jpg",
  },
  {
    slug: "arbaminch",
    name: "Arba Minch",
    short: "AM",
    image: "/images/branches/arbaminch.jpg",
  },
  {
    slug: "ziway",
    name: "Ziway",
    short: "ZW",
    image: "/images/branches/ziway.jpg",
  },
  {
    slug: "bahirdar",
    name: "Bahir Dar",
    short: "BD",
    image: "/images/branches/bahirdar.jpg",
  },
  {
    slug: "gondar",
    name: "Gondar",
    short: "GD",
    image: "/images/branches/gondar.jpg",
  },
  {
    slug: "dessie",
    name: "Dessie",
    short: "DS",
    image: "/images/branches/dessie.jpg",
  },
  {
    slug: "mekelle",
    name: "Mekelle",
    short: "MK",
    image: "/images/branches/mekelle.jpg",
  },
];

export default function DestinationMap() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  return (
    <section className="relative w-full py-20 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        Where do you want to go?
      </h2>

      <div className="relative max-w-7xl mx-auto">
        {/* Map container */}
        <div className="relative w-full h-[500px] md:h-[600px] bg-gray-200 rounded-2xl overflow-hidden">
          {/* Optional: Map image as background */}
          <Image
            src="/images/map-ethiopia.png"
            alt="Ethiopia Map"
            fill
            className="object-cover opacity-20"
            priority
          />

          {/* Branch Pins */}
          {BRANCHES.map((branch, i) => (
            <motion.div
              key={branch.slug}
              className="absolute cursor-pointer"
              style={{
                top: `${10 + i * 8}%`, // example positions (should be adjusted for realism)
                left: `${20 + (i % 3) * 25}%`,
              }}
              onClick={() =>
                setActiveBranch(
                  branch.slug === activeBranch ? null : branch.slug
                )
              }
              whileHover={{ scale: 1.3 }}
            >
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary shadow-lg border-2 border-white flex items-center justify-center text-white font-bold text-xs md:text-sm">
                {branch.short}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Branch info card */}
        <AnimatePresence>
          {activeBranch && (
            <motion.div
              key="branch-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 bg-white rounded-2xl shadow-2xl max-w-md w-full z-50 overflow-hidden"
            >
              {BRANCHES.filter((b) => b.slug === activeBranch).map((branch) => (
                <div key={branch.slug}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={branch.image}
                      alt={branch.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {branch.name}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Explore the finest experience in {branch.name}. Rooms,
                      services, and offers designed for comfort and luxury.
                    </p>
                    <button className="mt-4 px-6 py-3 bg-primary text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
