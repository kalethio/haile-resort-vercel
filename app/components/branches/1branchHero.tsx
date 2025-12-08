"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import BookingForm from "../bookingform";

interface Branch {
  branchName: string;
  heroVideoUrl?: string; // YouTube video ID
  heroTagline?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
  directionsUrl?: string;
}

interface HeroSectionProps {
  branch: Branch;
}

export default function HeroSection({ branch }: HeroSectionProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const tagline = branch.heroTagline || "Turn Your Vacation Dream Into Reality";
  const contact = branch.contact || {};

  // Clean YouTube embed URL (no-cookie domain, no controls, loop)
  const getVideoUrl = (videoId: string) => {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0&loop=1&playlist=${videoId}&background=1`;
  };

  return (
    <section className="relative w-full h-screen max-h-screen overflow-hidden">
      {/* YouTube Background Video */}
      <div className="absolute inset-0">
        {branch.heroVideoUrl ? (
          <iframe
            key={branch.heroVideoUrl}
            className="w-full h-full object-cover pointer-events-none"
            src={getVideoUrl(branch.heroVideoUrl)}
            title={`Welcome to ${branch.branchName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              border: "none",
              overflow: "hidden",
              objectFit: "cover",
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#f6efe9] via-[#e8d9d2] to-[#d7c2bb]" />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content Container */}
      <div className="relative h-full flex items-center">
        {/* Left gradient overlay for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-md lg:-translate-x-10">
            {/* Welcome Heading */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 leading-tight">
                Welcome to <br />
                <span className="text-[rgb(120,17,45)]">
                  {branch.branchName}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 font-light">
                {tagline}
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-3"
            >
              {contact.phone && (
                <a
                  href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-[rgb(120,17,45)] transition-colors group"
                >
                  <FaWhatsapp className="text-xl text-green-400" />
                  <span className="text-lg font-medium">{contact.phone}</span>
                </a>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-white hover:text-[rgb(120,17,45)] transition-colors group"
                >
                  <FiMail className="text-xl text-blue-400" />
                  <span className="text-lg font-medium">{contact.email}</span>
                </a>
              )}

              {branch.directionsUrl && (
                <a
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-[rgb(120,17,45)] transition-colors group"
                >
                  <FiMapPin className="text-xl text-red-400" />
                  <span className="text-lg font-medium">Get Directions</span>
                </a>
              )}
            </motion.div>
            {/* Book Now Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-10"
            >
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-8 py-4 text-lg font-semibold rounded-lg shadow-lg bg-[rgb(120,17,45)] text-white hover:scale-[1.02] active:scale-95 transition-transform duration-300 ring-2 ring-[rgb(120,17,45)]/20 focus:outline-none focus:ring-4 focus:ring-[rgb(120,17,45)]/25"
              >
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
            <BookingForm />
          </div>
        </div>
      )}
    </section>
  );
}
