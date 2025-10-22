"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { FiX, FiShare2, FiHeart } from "react-icons/fi";

// UPDATED: Match the API package structure
export interface Package {
  id: string;
  name: string; // CHANGED: from 'title' to 'name'
  description: string;
  price: number; // CHANGED: from string to number
  duration: string;
  // ADDED: Fields to maintain compatibility with existing component
  title?: string; // Optional for backward compatibility
  subtitle?: string;
  image?: string;
  ctaLabel?: string;
  details?: {
    price?: string; // Keep string version for display
    duration?: string;
    inclusions?: string[];
    highlights?: string[];
  };
}

interface ExperienceProps {
  image?: string;
  packages?: Package[];
  serviceDescription?: string[];
}

// Animation constants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Helper function to format package data for display
const formatPackageForDisplay = (pkg: Package): Package => {
  return {
    ...pkg,
    // Use name as title if title doesn't exist
    title: pkg.title || pkg.name,
    // Create a subtitle from duration
    subtitle: pkg.subtitle || `Duration: ${pkg.duration}`,
    // Format price for display
    details: {
      price: pkg.details?.price || `$${pkg.price}`,
      duration: pkg.details?.duration || pkg.duration,
      inclusions: pkg.details?.inclusions || [],
      highlights: pkg.details?.highlights || [],
    },
    // Default CTA label
    ctaLabel: pkg.ctaLabel || "View Package",
  };
};

export default function Experience({
  image,
  packages = [],
  serviceDescription = [
    "Discover Special Offers",
    "Curated Experiences Awaiting You",
  ],
}: ExperienceProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const globalOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, 0.95]
  );
  const bottomSpacerVH = Math.max(30, packages.length * 10);

  const toggleFavorite = (packageId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(packageId)) {
        newFavorites.delete(packageId);
      } else {
        newFavorites.add(packageId);
      }
      return newFavorites;
    });
  };

  const sharePackage = async (pkg: Package) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pkg.name,
          text: pkg.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${pkg.name} - ${pkg.description}\n${window.location.href}`
      );
      alert("Package details copied to clipboard!");
    }
  };

  // Format packages for display
  const displayPackages = packages.map(formatPackageForDisplay);

  return (
    <>
      <section
        ref={containerRef}
        className="relative overflow-hidden pt-16 md:pt-20"
        aria-labelledby="haile-packages-title"
      >
        {/* Section heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pt-8 md:pt-10 bg-gradient-to-t from-primary/5 to-transparent"
        >
          <motion.h2
            variants={itemVariants}
            id="haile-packages-title"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-center tracking-tight text-primary"
          >
            {serviceDescription.map((line, idx) => (
              <div
                key={idx}
                className={`${idx === 1 ? "mt-1 sm:mt-2 text-xl sm:text-2xl italic" : ""}`}
              >
                {line}
              </div>
            ))}
          </motion.h2>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="h-[8vh]" />
          <motion.div
            style={{ opacity: globalOpacity }}
            className="pointer-events-none sticky top-0 left-0 right-0 z-30 flex items-center justify-center"
          >
            <div className="max-w-6xl mx-auto w-full px-6 md:px-12 lg:px-20">
              <div className="space-y-20 md:space-y-24">
                {displayPackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    onViewDetails={setSelectedPackage}
                    onToggleFavorite={toggleFavorite}
                    onShare={sharePackage}
                    isFavorite={favorites.has(pkg.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          <div style={{ height: `${bottomSpacerVH}vh` }} />
        </div>

        {/* Mobile */}
        <div className="md:hidden max-w-3xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
          {displayPackages.map((pkg) => (
            <MobilePackageCard
              key={pkg.id}
              pkg={pkg}
              onViewDetails={setSelectedPackage}
              onToggleFavorite={toggleFavorite}
              onShare={sharePackage}
              isFavorite={favorites.has(pkg.id)}
            />
          ))}
        </div>
      </section>

      {/* Package Detail Modal */}
      <PackageModal
        pkg={selectedPackage}
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onToggleFavorite={toggleFavorite}
        onShare={sharePackage}
        isFavorite={selectedPackage ? favorites.has(selectedPackage.id) : false}
      />
    </>
  );
}

interface PackageCardProps {
  pkg: Package;
  index: number;
  onViewDetails: (pkg: Package) => void;
  onToggleFavorite: (packageId: string) => void;
  onShare: (pkg: Package) => void;
  isFavorite: boolean;
}

function PackageCard({
  pkg,
  index,
  onViewDetails,
  onToggleFavorite,
  onShare,
  isFavorite,
}: PackageCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const imgScale = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [0.98, 1.05, 1.1]
  );
  const cardY = useTransform(scrollYProgress, [0, 0.4, 1], [24, 0, -16]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0, 1, 1]);
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <motion.div
        style={{ y: cardY, opacity }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center py-8 md:pt-12 pointer-events-auto"
      >
        <div
          className={`${isReversed ? "order-2 md:order-1" : "order-1"} md:pr-8 lg:pr-10`}
        >
          <div className="relative h-64 sm:h-72 md:h-[420px] lg:h-[480px] w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-xl group">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl md:rounded-2xl" />
            )}
            <motion.div
              style={{ scale: imgScale }}
              className="absolute inset-0"
            >
              {/* UPDATED: Use experience image or fallback */}
              {pkg.image ? (
                <Image
                  src={pkg.image}
                  alt={pkg.title || pkg.name}
                  fill
                  style={{ objectFit: "cover" }}
                  onLoad={() => setImageLoaded(true)}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {pkg.title || pkg.name}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />

              {/* Action buttons overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(pkg.id);
                  }}
                  className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <FiHeart
                    className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(pkg);
                  }}
                  className="p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
                  aria-label="Share package"
                >
                  <FiShare2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className={`${
            isReversed
              ? "order-1 md:order-2 md:pl-8 lg:pl-10"
              : "order-2 md:pl-8 lg:pl-10"
          } flex flex-col justify-center space-y-4`}
        >
          <div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-semibold text-gray-800 leading-snug">
              {pkg.title || pkg.name}
            </h3>
            <h4 className="text-sm md:text-base lg:text-lg font-light text-gray-600 mt-1 md:mt-2">
              {pkg.subtitle || `Duration: ${pkg.duration}`}
            </h4>
          </div>

          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl whitespace-pre-line">
            {pkg.description}
          </p>

          {pkg.details?.price && (
            <div className="text-lg md:text-xl font-bold text-primary">
              {pkg.details.price}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <motion.button
              onClick={() => onViewDetails(pkg)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 md:px-8 py-3 md:py-3 text-sm font-semibold bg-primary/90 text-white rounded-lg shadow-md hover:bg-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {pkg.ctaLabel || "View Package"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface MobilePackageCardProps {
  pkg: Package;
  onViewDetails: (pkg: Package) => void;
  onToggleFavorite: (packageId: string) => void;
  onShare: (pkg: Package) => void;
  isFavorite: boolean;
}

function MobilePackageCard({
  pkg,
  onViewDetails,
  onToggleFavorite,
  onShare,
  isFavorite,
}: MobilePackageCardProps) {
  const [open, setOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center cursor-pointer bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
      onClick={() => setOpen(!open)}
    >
      <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden shadow-md mb-4">
        {!imageLoaded && pkg.image && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
        )}
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.title || pkg.name}
            fill
            style={{ objectFit: "cover" }}
            onLoad={() => setImageLoaded(true)}
            className="rounded-xl"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-xl">
            <span className="text-white text-lg font-semibold">
              {pkg.title || pkg.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl" />

        {/* Mobile action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(pkg.id);
            }}
            className="p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <FiHeart
              className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(pkg);
            }}
            className="p-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white"
            aria-label="Share package"
          >
            <FiShare2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full px-2">
        <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-800">
          {pkg.title || pkg.name}
        </h3>
        <h4 className="text-xs sm:text-sm font-light text-gray-600 mt-1">
          {pkg.subtitle || `Duration: ${pkg.duration}`}
        </h4>

        {(pkg.details?.price || pkg.price) && (
          <div className="text-base font-bold text-primary mt-2">
            {pkg.details?.price || `$${pkg.price}`}
          </div>
        )}

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
          }
          className="overflow-hidden mt-3"
        >
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 text-left">
            {pkg.description}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(pkg);
            }}
            className="w-full py-2.5 text-xs font-semibold bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            View Full Details
          </button>
        </motion.div>

        {!open && (
          <div className="mt-3 text-xs text-gray-500">
            Tap to see more details
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface PackageModalProps {
  pkg: Package | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (packageId: string) => void;
  onShare: (pkg: Package) => void;
  isFavorite: boolean;
}

function PackageModal({
  pkg,
  isOpen,
  onClose,
  onToggleFavorite,
  onShare,
  isFavorite,
}: PackageModalProps) {
  if (!pkg) return null;

  const displayPackage = formatPackageForDisplay(pkg);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-64 sm:h-80">
              {displayPackage.image ? (
                <Image
                  src={displayPackage.image}
                  alt={displayPackage.title || displayPackage.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center rounded-t-2xl">
                  <span className="text-white text-2xl font-semibold">
                    {displayPackage.title || displayPackage.name}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />

              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleFavorite(displayPackage.id)}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <FiHeart
                    className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onShare(displayPackage)}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                  aria-label="Share package"
                >
                  <FiShare2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                  aria-label="Close modal"
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-800">
                {displayPackage.title || displayPackage.name}
              </h2>
              <h3 className="text-lg sm:text-xl font-light text-gray-600 mt-1">
                {displayPackage.subtitle ||
                  `Duration: ${displayPackage.duration}`}
              </h3>

              {displayPackage.details?.price && (
                <div className="text-xl sm:text-2xl font-bold text-primary mt-3">
                  {displayPackage.details.price}
                </div>
              )}

              <p className="text-gray-700 leading-relaxed mt-4 whitespace-pre-line">
                {displayPackage.description}
              </p>

              {displayPackage.details?.inclusions &&
                displayPackage.details.inclusions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Package Includes:
                    </h4>
                    <ul className="space-y-2">
                      {displayPackage.details.inclusions.map(
                        (inclusion, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-700"
                          >
                            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                            {inclusion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              <div className="flex gap-3 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Book Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
