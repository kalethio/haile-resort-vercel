// --------------------------------------
// Package type definition
// --------------------------------------
export type Package = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel?: string;
};

// --------------------------------------
// Static package data
// --------------------------------------
export const PACKAGES: Package[] = [
  {
    id: "family",
    title: "Family Vacation",
    subtitle: "Unforgettable Moments Together",
    description: `Create lasting memories with your loved ones at Haile Hotels. Our family-friendly amenities, spacious rooms, and curated activities ensure fun and relaxation for all ages.`,
    image: "/images/packages/family.jpg",
    ctaLabel: "Book Now and Enjoy the experience",
  },
  {
    id: "romantic",
    title: "Romantic Getaway",
    subtitle: "A Retreat for Two",
    description: `Escape with your special someone to our serene settings. Enjoy candlelit dinners, couples’ spa experiences, and breathtaking views for the perfect romantic retreat.`,
    image: "/images/packages/romantic.jpg",
    ctaLabel: "Book Now and Enjoy the experience",
  },
  {
    id: "wellness",
    title: "Wellness Retreat",
    subtitle: "Rejuvenate Your Mind & Body",
    description: `Refresh and recharge with holistic wellness programs. From yoga sessions to spa therapies, our retreat is designed to nurture your body, mind, and soul.`,
    image: "/images/packages/wellness.jpg",
    ctaLabel: "Book Now and Enjoy the experience",
  },
  {
    id: "cultural",
    title: "Cultural Discovery",
    subtitle: "Explore Local Heritage",
    description: `Immerse yourself in Ethiopia’s rich culture. Guided tours, local cuisine experiences, and curated workshops make your stay an authentic journey of discovery.`,
    image: "/images/packages/cultural.jpg",
    ctaLabel: "Book Now and Enjoy the experience",
  },
  {
    id: "nature",
    title: "Nature Escape",
    subtitle: "Connect with the Outdoors",
    description: `Experience tranquility amidst lush landscapes. Hiking, scenic views, and eco-friendly activities allow you to reconnect with nature in style and comfort.`,
    image: "/images/packages/nature.jpg",
    ctaLabel: "Book Now and Enjoy the experience",
  },
];
