"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import BookingForm from "../bookingform";

interface Branch {
  branchName: string;
  heroVideoUrl?: string;
  heroTagline?: string;
  heroImage?: string;
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
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0);

  const textPanelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textPanelRef, { once: true, amount: 0.3 });
  const { scrollY } = useScroll();

  // Scroll animations
  const videoScale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const textPanelY = useTransform(scrollY, [0, 200], [0, 50]);

  // Text panel background opacity: starts transparent (0), becomes solid white (1) after scrolling 50px
  const panelBgOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  // Update bgOpacity when panelBgOpacity changes
  useEffect(() => {
    const unsubscribe = panelBgOpacity.onChange((value) => {
      setBgOpacity(value);
    });
    return () => unsubscribe();
  }, [panelBgOpacity]);

  useEffect(() => {
    console.log("HeroSection received:", {
      videoUrl: branch.heroVideoUrl,
      imageUrl: branch.heroImage,
    });
  }, [branch]);

  const tagline = branch.heroTagline || "Turn Your Vacation Dream Into Reality";
  const contact = branch.contact || {};

  const getVideoUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&loop=1&playlist=${videoId}`;
  };

  const showVideo = branch.heroVideoUrl && !videoError;

  // Animation variants for text appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
    },
  };

  const contactItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.3 + i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <>
      {/* Desktop: Overlapping design (lg and up) */}
      <div className="hidden lg:relative lg:block w-full h-screen max-h-screen overflow-hidden">
        {/* Video Background with scale animation on scroll */}
        <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
          {showVideo ? (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                key={branch.heroVideoUrl}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
                src={getVideoUrl(branch.heroVideoUrl)}
                title={`Welcome to ${branch.branchName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setVideoError(true)}
                style={{
                  border: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          ) : branch.heroImage && !imageError ? (
            <img
              src={branch.heroImage}
              alt={branch.branchName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </motion.div>

        {/* Text Panel - Bottom centered with scroll animation and dynamic background */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none"
          style={{ y: textPanelY }}
        >
          <motion.div
            ref={textPanelRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="pointer-events-auto rounded-t-3xl px-6 pt-8 pb-10 sm:px-8 sm:pt-10 sm:pb-12 lg:px-12 lg:pt-12 lg:pb-14 max-w-2xl mx-auto w-full transition-all duration-300"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
            }}
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-extrabold mb-2 leading-tight sm:text-3xl lg:text-4xl text-center transition-colors duration-300"
              style={{
                color: bgOpacity > 0.5 ? "#111827" : "white",
              }}
            >
              Welcome to <br />
              <span className="text-[rgb(120,17,45)]">{branch.branchName}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm font-light mb-6 sm:text-base lg:text-lg text-center transition-colors duration-300"
              style={{
                color: bgOpacity > 0.5 ? "#4B5563" : "#E5E7EB",
              }}
            >
              {tagline}
            </motion.p>

            <div className="space-y-3 mb-6 sm:space-y-4 sm:mb-8 max-w-md mx-auto">
              {contact.phone && (
                <motion.a
                  custom={0}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 transition-colors"
                  style={{
                    color: bgOpacity > 0.5 ? "#374151" : "#D1D5DB",
                  }}
                  whileHover={{ color: "rgb(120,17,45)" }}
                >
                  <FaWhatsapp className="text-lg sm:text-xl text-green-400" />
                  <span className="text-sm font-medium sm:text-base">
                    {contact.phone}
                  </span>
                </motion.a>
              )}
              {contact.email && (
                <motion.a
                  custom={1}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  href={`mailto:${contact.email}`}
                  className="flex items-center justify-center gap-3 transition-colors"
                  style={{
                    color: bgOpacity > 0.5 ? "#374151" : "#D1D5DB",
                  }}
                  whileHover={{ color: "rgb(120,17,45)" }}
                >
                  <FiMail className="text-lg sm:text-xl text-blue-400" />
                  <span className="text-sm font-medium sm:text-base">
                    {contact.email}
                  </span>
                </motion.a>
              )}
              {branch.directionsUrl && (
                <motion.a
                  custom={2}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 transition-colors"
                  style={{
                    color: bgOpacity > 0.5 ? "#374151" : "#D1D5DB",
                  }}
                  whileHover={{ color: "rgb(120,17,45)" }}
                >
                  <FiMapPin className="text-lg sm:text-xl text-red-400" />
                  <span className="text-sm font-medium sm:text-base">
                    Get Directions
                  </span>
                </motion.a>
              )}
            </div>

            <motion.button
              variants={buttonVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowBookingForm(true)}
              className="w-full py-3 text-base font-semibold rounded-lg bg-[rgb(120,17,45)] text-white hover:bg-[rgb(100,12,38)] transition-colors duration-300 sm:py-4 sm:text-lg max-w-md mx-auto block"
            >
              Book Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile: COMPLETELY SEPARATE - Video on top, Text box below (no overlap, no absolute positioning) */}
      <div className="lg:hidden flex flex-col w-full min-h-screen">
        {/* Video section - full width, 50vh height, NO text overlay */}
        <div className="relative w-full h-[50vh] bg-black overflow-hidden flex-shrink-0">
          {showVideo ? (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                key={branch.heroVideoUrl}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
                src={getVideoUrl(branch.heroVideoUrl)}
                title={`Welcome to ${branch.branchName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setVideoError(true)}
                style={{
                  border: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          ) : branch.heroImage && !imageError ? (
            <img
              src={branch.heroImage}
              alt={branch.branchName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </div>

        {/* Text section - SEPARATE, below video, white background, scrollable, NO absolute positioning */}
        <div className="flex-1 bg-white px-6 py-10 overflow-y-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight text-center"
            >
              Welcome to <br />
              <span className="text-[rgb(120,17,45)]">{branch.branchName}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-600 font-light mb-6 text-center"
            >
              {tagline}
            </motion.p>

            <div className="space-y-3 mb-6 max-w-md mx-auto">
              {contact.phone && (
                <motion.a
                  custom={0}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-gray-700 hover:text-[rgb(120,17,45)] transition-colors"
                >
                  <FaWhatsapp className="text-lg text-green-600" />
                  <span className="text-sm font-medium">{contact.phone}</span>
                </motion.a>
              )}
              {contact.email && (
                <motion.a
                  custom={1}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={`mailto:${contact.email}`}
                  className="flex items-center justify-center gap-3 text-gray-700 hover:text-[rgb(120,17,45)] transition-colors"
                >
                  <FiMail className="text-lg text-blue-600" />
                  <span className="text-sm font-medium">{contact.email}</span>
                </motion.a>
              )}
              {branch.directionsUrl && (
                <motion.a
                  custom={2}
                  variants={contactItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={branch.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-gray-700 hover:text-[rgb(120,17,45)] transition-colors"
                >
                  <FiMapPin className="text-lg text-red-600" />
                  <span className="text-sm font-medium">Get Directions</span>
                </motion.a>
              )}
            </div>

            <motion.button
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowBookingForm(true)}
              className="w-full py-3 text-base font-semibold rounded-lg bg-[rgb(120,17,45)] text-white hover:bg-[rgb(100,12,38)] transition-colors duration-300 max-w-md mx-auto block"
            >
              Book Now
            </motion.button>
          </motion.div>
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
    </>
  );
}
