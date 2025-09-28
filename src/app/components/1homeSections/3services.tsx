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
      "Savor Ethiopian heritage and global flavors, including Haile’s signature coffee and gourmet dining.",
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

// Card animation: slide-up with smooth stagger
const cardVariants = {
  hidden: { y: 50, opacity: 0 }, // start 50px below and invisible
  visible: (custom: number) => ({
    y: 0, // animate to natural position
    opacity: 1,
    transition: {
      duration: 0.7, // slightly slower for smoother feel
      delay: custom * 0.2, // stagger cards turn by turn
      ease: [0.25, 0.8, 0.25, 1], // smooth easeOut
    },
  }),
};

export default function ServicesSection() {
  return (
    <section className="relative w-full px-6 sm:px-12 lg:px-20 py-24 bg-background text-text">
      {/* Section Heading */}
      <h2 className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-center mb-16 tracking-tight text-primary">
        Experience the Haile Difference
      </h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.title}
            className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-background/30 backdrop-blur-md transition-transform duration-200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={cardVariants}
            custom={index} // pass index for staggered delay
          >
            {/* Card Image */}
            <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-3xl">
              <img
                src={service.image}
                alt={service.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            {/* Card Text */}
            <div className="p-4 sm:p-6 lg:p-7">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary mb-2">
                {service.title}
              </h3>
              <p className="text-accent text-sm sm:text-base lg:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
