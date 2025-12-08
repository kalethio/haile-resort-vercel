"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import Image from "next/image";

// ==================== HARDCODED DATA ====================
export const SERVICES_DATA = [
  {
    id: 1,
    title: "Restaurant",
    description:
      "Our resort has eight food and beverage outlets serving both local and international cuisine.",
    image: "/uploads/accommodations/restaurant.jpg",
  },
  {
    id: 2,
    title: "Spa - Beauty & Health",
    description: "Rejuvenate yourself after an exhausting work schedule.",
    image: "/uploads/accommodations/beauty.jpg",
  },
  {
    id: 3,
    title: "Conference Room",
    description:
      "Halls facilities including sound system, stationery materials (notebook, pen, flip chart & stand) and LCD Projector.",
    image: "/uploads/accommodations/conference.jpg",
  },
  {
    id: 4,
    title: "Swimming Pool",
    description: "Make swimming a part of your lifestyle",
    image: "/uploads/accommodations/swimming.jpg",
  },
  {
    id: 5,
    title: "Multi-purpose Halls",
    description:
      "multi-purpose halls that are outfitted with modern meeting equipment and supplies allowing variety of setups including meetings, workshops or weddings. Venue occupancy is based on the standard set up.",

    image: "/uploads/accommodations/halls.jpg",
  },
] as const;

// ==================== COMPONENT ====================
const AccommodationCarousel: React.FC = () => {
  const [cards, setCards] = useState(SERVICES_DATA);
  const [isAnimating, setIsAnimating] = useState(false);

  const centerIndex = Math.floor(cards.length / 2);

  const rotateNext = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newCards = [...cards];
    const first = newCards.shift()!;
    newCards.push(first);

    setCards(newCards);
    setTimeout(() => setIsAnimating(false), 400);
  }, [cards, isAnimating]);

  const handleCardClick = (index: number) => {
    if (index === centerIndex) return;

    const clicksNeeded =
      index > centerIndex
        ? index - centerIndex
        : cards.length - centerIndex + index;

    let rotations = 0;
    const rotateToCenter = () => {
      if (rotations < clicksNeeded) {
        rotateNext();
        rotations++;
        setTimeout(rotateToCenter, 150);
      }
    };
    rotateToCenter();
  };

  return (
    <motion.section
      className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-gray-50/30"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-primary mb-12 md:mb-16 px-4"
      >
        <span className="text-3xl md:text-4xl font-serif tracking-widest uppercase block">
          Services
        </span>
      </motion.h2>

      {/* Carousel Cards */}
      <div className="relative flex justify-center items-center gap-6 md:gap-8 lg:gap-10 overflow-hidden py-6 md:py-8 px-4">
        {cards.map((item, index) => {
          const distanceFromCenter = Math.abs(index - centerIndex);
          const isCenter = index === centerIndex;
          const isVisible = distanceFromCenter <= 2;

          let animationState = cardAnimations.side;
          if (isCenter) animationState = cardAnimations.center;
          if (!isVisible) animationState = cardAnimations.hidden;

          return (
            <motion.div
              key={`${item.title}-${index}`}
              className="flex-shrink-0 cursor-pointer"
              animate={animationState}
              whileHover={{
                scale: isCenter ? 1.15 : 0.92,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              transition={transition}
              onClick={() => handleCardClick(index)}
            >
              <div className="flex flex-col items-center">
                {/* Image with gradient overlay */}
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isCenter
                      ? "shadow-2xl ring-3 ring-primary/30"
                      : "shadow-lg ring-1 ring-gray-200/50"
                  } w-60 md:w-72 lg:w-80`}
                >
                  <div className="relative w-full h-52 md:h-60 lg:h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 240px, (max-width: 1024px) 288px, 320px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`mt-4 font-serif uppercase text-center font-medium ${
                    isCenter
                      ? "text-gray-900 text-lg md:text-xl font-semibold"
                      : "text-gray-600 text-base"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Description only for center card */}
                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3 text-center max-w-xs md:max-w-sm"
                  >
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot Indicators with Next Button */}
      <div className="flex justify-center items-center mt-8 gap-4">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {SERVICES_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const targetIndex = index;
                const currentCenterTitle = cards[centerIndex]?.title;
                if (SERVICES_DATA[targetIndex]?.title !== currentCenterTitle) {
                  rotateNext();
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                cards[centerIndex]?.title === SERVICES_DATA[index]?.title
                  ? "bg-primary w-4"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={rotateNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isAnimating}
          className="w-8 h-8 cursor-pointer bg-primary/15 rounded-full flex items-center justify-center shadow hover:shadow-md hover:bg-primary/25 transition-all duration-300 border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Next service"
        >
          <FiChevronRight size={16} className="text-primary" />
        </motion.button>
      </div>

      {/* Loading Skeleton */}
      {!SERVICES_DATA.length && (
        <div className="flex justify-center items-center gap-6 md:gap-8 py-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-60 md:w-72 rounded-2xl bg-gray-200 animate-pulse h-80"
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

// Animation constants (unchanged)
const cardAnimations = {
  center: {
    scale: 1.12,
    opacity: 1,
    filter: "blur(0px) brightness(100%)",
    zIndex: 20,
  },
  side: {
    scale: 0.88,
    opacity: 1,
    filter: "blur(2px) brightness(75%)",
    zIndex: 5,
  },
  hidden: {
    scale: 0.8,
    opacity: 0,
    filter: "blur(4px) brightness(50%)",
    zIndex: 1,
  },
};

const transition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 35,
  duration: 0.5,
};

export default AccommodationCarousel;
