"use client";
import { motion } from "framer-motion";

export const SERVICES = [
  {
    title: "Scenic Luxury Stays",
    description:
      "Experience breathtaking views and elegant accommodations across Ethiopia’s finest destinations.",
    image: "/images/services/stays.jpg",
  },
  {
    title: "Authentic Cultural Journeys",
    description:
      "Savor Ethiopian heritage and global flavors, including Haile's signature coffee and gourmet dining.",
    image: "/images/services/dining.jpg",
  },
  {
    title: "Wellness & Recreation",
    description:
      "Relax, recharge, and play—our spas, gyms, and outdoor activities are designed for every guest.",
    image: "/images/services/wellness.jpg",
  },
  {
    title: "Events & Conferences",
    description:
      "Host unforgettable weddings, retreats, and meetings in our fully equipped, elegant venues.",
    image: "/images/services/events.jpg",
  },
];

// Elegant fade-in from bottom with slight scale
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for smoothness
    },
  },
};

// Container for beautiful stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Perfect timing between cards
      delayChildren: 0.3, // Wait a bit before starting
    },
  },
};

// Hover animation - elegant lift and glow
const hoverCard = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

// Image hover effect
const imageHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ServicesSection() {
  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-20 py-24 bg-background text-text">
      {/* Section Heading */}
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-center mb-16 tracking-tight text-primary"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Experience the Haile Difference
      </motion.h2>

      {/* Services Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.title}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            {/* Card Image */}
            <motion.div
              className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden"
              variants={imageHover}
            >
              <img
                src={service.image}
                alt={service.title}
                className="object-cover w-full h-full"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            </motion.div>

            {/* Card Content */}
            <motion.div className="p-6 bg-white" variants={hoverCard}>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>

            {/* Subtle border on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/10 transition-all duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
