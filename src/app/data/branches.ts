// src/app/data/branches.ts

// --------------------------------------
// Type definitions
// --------------------------------------
export type Attraction = {
  id: string;
  label: string;
  image: string;
};

export type Accommodation = {
  title: string;
  image: string;
  description: string;
};

export type Package = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaLabel?: string;
};

export type Experience = {
  highlightImage: string;
  packages: Package[];
};

export type Branch = {
  branchName: string;
  description: string;
  heroImage: string;
  directionsUrl: string;
  contact: { phone: string; email: string };
  attractions: Attraction[];
  accommodations: Accommodation[];
  experiences: Experience;
};

// --------------------------------------
// Branches data
// --------------------------------------
export const BRANCHES: Record<string, Branch> = {
  "addis-ababa": {
    branchName: "Addis Ababa",
    description: "Luxury stay in the heart of Ethiopia's capital.",
    heroImage: "/images/branches/addis-hero.jpg",
    directionsUrl: "https://maps.google.com?q=Addis+Ababa",
    contact: {
      phone: "+251 911 000 111",
      email: "addis@example.com",
    },
    attractions: [
      {
        id: "a1",
        label: "Lagoon View",
        image: "/images/branches/addis-lagoon.jpg",
      },
      {
        id: "a2",
        label: "Cliff Dining",
        image: "/images/branches/addis-cliff.jpg",
      },
      {
        id: "a3",
        label: "Sunset Terrace",
        image: "/images/branches/addis-sunset.jpg",
      },
    ],
    accommodations: [
      {
        title: "FIVE-BEDROOM BEACHFRONT VILLA",
        image: "/images/branches/addis-villa.jpg",
        description:
          "Experience ultimate luxury and breathtaking ocean views in our expansive five-bedroom beachfront villa.",
      },
      {
        title: "DELUXE OCEAN-VIEW ROOM",
        image: "/images/branches/addis-room.jpg",
        description:
          "Wake up to stunning panoramic views of the ocean in our elegantly designed deluxe rooms.",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/addis-experience.jpg",
      packages: [
        {
          id: "family",
          title: "Family Vacation",
          subtitle: "Unforgettable Moments Together",
          description:
            "Create lasting memories with your loved ones at Haile Hotels. Our family-friendly amenities ensure fun and relaxation for all ages.",
          image: "/images/packages/family.jpg",
          ctaLabel: "View Package",
        },
        {
          id: "romantic",
          title: "Romantic Getaway",
          subtitle: "A Retreat for Two",
          description:
            "Escape with your special someone to our serene settings. Enjoy candlelit dinners, couples’ spa experiences, and breathtaking views.",
          image: "/images/packages/romantic.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
  },

  hawassa: {
    branchName: "Hawassa",
    description: "Relaxing lakeside escape with premium amenities.",
    heroImage: "/images/branches/hawassa-hero.jpg",
    directionsUrl: "https://maps.google.com?q=Hawassa",
    contact: {
      phone: "+251 911 111 222",
      email: "hawassa@example.com",
    },
    attractions: [
      {
        id: "a1",
        label: "Lakefront Lounge",
        image: "/images/branches/hawassa-lake.jpg",
      },
      {
        id: "a2",
        label: "Sunset Cruise",
        image: "/images/branches/hawassa-sunset.jpg",
      },
    ],
    accommodations: [
      {
        title: "LAKESIDE VILLA",
        image: "/images/branches/hawassa-villa.jpg",
        description:
          "Enjoy panoramic lake views from our luxurious lakeside villa.",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/hawassa-experience.jpg",
      packages: [
        {
          id: "wellness",
          title: "Wellness Retreat",
          subtitle: "Rejuvenate Your Mind & Body",
          description:
            "Refresh and recharge with holistic wellness programs. Yoga, spa, and nature walks await.",
          image: "/images/packages/wellness.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
  },

  "bahir-dar": {
    branchName: "Bahir Dar",
    description: "Riverside luxury with cultural experiences.",
    heroImage: "/images/branches/bahir-dar-hero.jpg",
    directionsUrl: "https://maps.google.com?q=Bahir+Dar",
    contact: {
      phone: "+251 911 222 333",
      email: "bahirdar@example.com",
    },
    attractions: [
      {
        id: "a1",
        label: "Blue Nile Falls",
        image: "/images/branches/bahir-dar-falls.jpg",
      },
      {
        id: "a2",
        label: "Riverfront Dining",
        image: "/images/branches/bahir-dar-river.jpg",
      },
    ],
    accommodations: [
      {
        title: "RIVERSIDE SUITE",
        image: "/images/branches/bahir-dar-suite.jpg",
        description:
          "Premium riverside suite with private terrace and luxury amenities.",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/bahir-dar-experience.jpg",
      packages: [
        {
          id: "cultural",
          title: "Cultural Discovery",
          subtitle: "Explore Local Heritage",
          description:
            "Immerse yourself in Ethiopia’s rich culture with guided tours, local cuisine, and curated workshops.",
          image: "/images/packages/cultural.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
  },
};
