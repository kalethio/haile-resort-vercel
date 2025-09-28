"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import BookingForm from "../bookingform";

interface Attraction {
  image: string;
  label: string;
}

interface BranchTemplateProps {
  branch: {
    branchName: string;
    heroImage: string;
    shortDescription?: string;
    location?: { mapsUrl?: string };
    attractions?: { image: string; label: string }[]; // ✅ added to align with BranchHero
    accommodations: any[];
    experiences: {
      highlightImage: string;
      packages: any[];
    };
  };
}

export default function BranchHero({ branch, onOpenBooking }: BranchHeroProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Safely pick selected attraction or fallback to heroImage
  const selectedAttraction =
    activeIndex !== null
      ? branch.attractions?.[activeIndex]
      : {
          image: branch.heroImage ?? "/default-hero.jpg", // fallback image
          label: "Welcome",
        };

  // Ref for horizontal scroll container (if you have one)
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Hero Image */}
      {selectedAttraction?.image && (
        <Image
          src={selectedAttraction.image}
          alt={selectedAttraction.label}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-serif text-white font-semibold mb-4">
          {branch.name ?? "Our Branch"}
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl">
          {branch.shortDescription ?? "Experience luxury and comfort."}
        </p>
        {onOpenBooking && (
          <button
            onClick={onOpenBooking}
            className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/80 transition"
          >
            Book Now
          </button>
        )}
      </div>

      {/* Attractions Thumbnails */}
      {branch.attractions && branch.attractions.length > 0 && (
        <div
          ref={listRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 overflow-x-auto px-4"
        >
          {branch.attractions.map((attr, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-24 h-16 rounded-lg overflow-hidden border-2 ${
                idx === activeIndex ? "border-white" : "border-transparent"
              }`}
            >
              <Image
                src={attr.image}
                alt={attr.label}
                fill
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
