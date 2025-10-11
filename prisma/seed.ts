import { PrismaClient } from "@prisma/client";
import fs from "fs";
const prisma = new PrismaClient();

const branches = {
  "addis-ababa": {
    branchName: "Addis Ababa",
    description: "Luxury stay in the heart of Ethiopia's capital.",
    heroImage: "/images/branchesPictures/branchHero1.jpg",
    directionsUrl: "https://maps.app.goo.gl/moSASbKtrToTsASs8",
    contact: { phone: "+251 911 000 111", email: "addis@example.com" },
    attractions: [
      {
        id: "a1",
        label: "Lagoon View",
        image: "/images/branchesPictures/attraction-tabor.jpg",
      },
      {
        id: "a2",
        label: "Cliff Dining",
        image: "/images/branchesPictures/attraction-chembelala.jpg",
      },
      {
        id: "a3",
        label: "Sunset Terrace",
        image: "/images/branchesPictures/attraction-St_Gabriel_Church.jpg",
      },
    ],
    accommodations: [
      {
        title: "FIVE-BEDROOM BEACHFRONT VILLA",
        description: "Experience ultimate luxury and ocean views...",
        image: "/images/branchesPictures/Accomodation1.jpg",
      },
      {
        title: "DELUXE OCEAN-VIEW ROOM",
        description: "Relax in our deluxe ocean-view room...",
        image: "/images/branchesPictures/Accomodation2.jpg",
      },
      {
        title: "TROPICAL GARDEN SUITE",
        description:
          "Surrounded by lush gardens, this suite offers tranquility...",
        image: "/images/branchesPictures/Accomodation3.jpg",
      },
      {
        title: "PENTHOUSE SUITE WITH TERRACE",
        description: "Enjoy panoramic city views from the private terrace...",
        image: "/images/branchesPictures/Accomodation4.jpg",
      },
      {
        title: "COZY MOUNTAIN COTTAGE",
        description: "Nestled in the mountains, this cozy cottage is ideal...",
        image: "/images/branchesPictures/Accomodation5.jpg",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/addis-experience.jpg",
      packages: [
        {
          id: "family",
          title: "Family Vacation",
          subtitle: "Unforgettable Moments Together",
          description: "Create lasting memories...",
          image: "/images/branchesPictures/Experience1.jpg",
          ctaLabel: "View Package",
        },
        {
          id: "romantic",
          title: "Romantic Getaway",
          subtitle: "A Retreat for Two",
          description: "Escape with your special someone...",
          image: "/images/branchesPictures/Experience2.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
    starRating: 5,
    seo: {
      title: "Haile Grand Addis Ababa | Luxury Hotel",
      description:
        "Luxury stay in the heart of Addis Ababa with premium amenities.",
      keywords: ["Addis Ababa", "Haile Resort", "Luxury Hotel", "Ethiopia"],
    },
    location: {
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
    },
    published: true,
  },

  hawassa: {
    branchName: "Hawassa",
    description: "Relaxing lakeside escape with premium amenities.",
    heroImage: "/images/branchesPictures/branchHero2.jpg",
    directionsUrl: "https://maps.app.goo.gl/moSASbKtrToTsASs8",
    contact: { phone: "+251 911 111 222", email: "hawassa@example.com" },
    attractions: [
      {
        id: "a1",
        label: "Lagoon View",
        image: "/images/branchesPictures/attraction-tabor.jpg",
      },
      {
        id: "a2",
        label: "Cliff Dining",
        image: "/images/branchesPictures/attraction-chembelala.jpg",
      },
      {
        id: "a3",
        label: "Sunset Terrace",
        image: "/images/branchesPictures/attraction-St_Gabriel_Church.jpg",
      },
    ],
    accommodations: [
      {
        title: "FIVE-BEDROOM BEACHFRONT VILLA",
        description: "Experience ultimate luxury and ocean views...",
        image: "/images/branchesPictures/Accomodation1.jpg",
      },
      {
        title: "DELUXE OCEAN-VIEW ROOM",
        description: "Relax in our deluxe ocean-view room...",
        image: "/images/branchesPictures/Accomodation2.jpg",
      },
      {
        title: "TROPICAL GARDEN SUITE",
        description:
          "Surrounded by lush gardens, this suite offers tranquility...",
        image: "/images/branchesPictures/Accomodation3.jpg",
      },
      {
        title: "PENTHOUSE SUITE WITH TERRACE",
        description: "Enjoy panoramic city views from the private terrace...",
        image: "/images/branchesPictures/Accomodation4.jpg",
      },
      {
        title: "COZY MOUNTAIN COTTAGE",
        description: "Nestled in the mountains, this cozy cottage is ideal...",
        image: "/images/branchesPictures/Accomodation5.jpg",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/hawassa-experience.jpg",
      packages: [
        {
          id: "family",
          title: "Family Vacation",
          subtitle: "Unforgettable Moments Together",
          description: "Create lasting memories...",
          image: "/images/branchesPictures/Experience1.jpg",
          ctaLabel: "View Package",
        },
        {
          id: "romantic",
          title: "Romantic Getaway",
          subtitle: "A Retreat for Two",
          description: "Escape with your special someone...",
          image: "/images/branchesPictures/Experience2.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
    starRating: 4,
    seo: {
      title: "Haile Resort Hawassa | Lakeside Escape",
      description:
        "A tranquil getaway by the lake with luxury and nature combined.",
      keywords: ["Hawassa", "Resort", "Lake View", "Ethiopia", "Haile Resort"],
    },
    location: { city: "Hawassa", region: "Sidama", country: "Ethiopia" },
    published: true,
  },

  arbaminch: {
    branchName: "Arbaminch",
    description: "Riverside luxury with cultural experiences.",
    heroImage: "/images/branchesPictures/branchHero3.jpg",
    directionsUrl: "https://maps.app.goo.gl/moSASbKtrToTsASs8",
    contact: { phone: "+251 911 222 333", email: "arbaminch@example.com" },
    attractions: [
      {
        id: "a1",
        label: "Lagoon View",
        image: "/images/branchesPictures/attraction-tabor.jpg",
      },
      {
        id: "a2",
        label: "Cliff Dining",
        image: "/images/branchesPictures/attraction-chembelala.jpg",
      },
      {
        id: "a3",
        label: "Sunset Terrace",
        image: "/images/branchesPictures/attraction-St_Gabriel_Church.jpg",
      },
    ],
    accommodations: [
      {
        title: "FIVE-BEDROOM BEACHFRONT VILLA",
        description: "Experience ultimate luxury and ocean views...",
        image: "/images/branchesPictures/Accomodation1.jpg",
      },
      {
        title: "DELUXE OCEAN-VIEW ROOM",
        description: "Relax in our deluxe ocean-view room...",
        image: "/images/branchesPictures/Accomodation2.jpg",
      },
      {
        title: "TROPICAL GARDEN SUITE",
        description:
          "Surrounded by lush gardens, this suite offers tranquility...",
        image: "/images/branchesPictures/Accomodation3.jpg",
      },
      {
        title: "PENTHOUSE SUITE WITH TERRACE",
        description: "Enjoy panoramic city views from the private terrace...",
        image: "/images/branchesPictures/Accomodation4.jpg",
      },
      {
        title: "COZY MOUNTAIN COTTAGE",
        description: "Nestled in the mountains, this cozy cottage is ideal...",
        image: "/images/branchesPictures/Accomodation5.jpg",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/arbaminch-experience.jpg",
      packages: [
        {
          id: "family",
          title: "Family Vacation",
          subtitle: "Unforgettable Moments Together",
          description: "Create lasting memories...",
          image: "/images/branchesPictures/Experience1.jpg",
          ctaLabel: "View Package",
        },
        {
          id: "romantic",
          title: "Romantic Getaway",
          subtitle: "A Retreat for Two",
          description: "Escape with your special someone...",
          image: "/images/branchesPictures/Experience2.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
    starRating: 4,
    seo: {
      title: "Haile Resort Arbaminch | Riverside Luxury",
      description:
        "Riverside elegance with a cultural touch, nestled in Arbaminch.",
      keywords: ["Arbaminch", "Resort", "Culture", "Ethiopia", "Haile Resort"],
    },
    location: {
      city: "Arbaminch",
      region: "Southern Nations",
      country: "Ethiopia",
    },
    published: true,
  },

  gondar: {
    branchName: "Gondar",
    description: "Historic city stay with modern luxury.",
    heroImage: "/images/branchesPictures/branchHero4.jpg",
    directionsUrl: "https://maps.app.goo.gl/moSASbKtrToTsASs8",
    contact: { phone: "+251 911 333 444", email: "gondar@example.com" },
    attractions: [
      {
        id: "a1",
        label: "Royal Castle",
        image: "/images/branchesPictures/attraction-castle.jpg",
      },
      {
        id: "a2",
        label: "Fasil Falls",
        image: "/images/branchesPictures/attraction-fasil.jpg",
      },
      {
        id: "a3",
        label: "Market Square",
        image: "/images/branchesPictures/attraction-market.jpg",
      },
    ],
    accommodations: [
      {
        title: "Royal Suite",
        description: "Luxurious suite with historic views...",
        image: "/images/branchesPictures/Accomodation6.jpg",
      },
      {
        title: "Standard Room",
        description: "Comfortable room with modern amenities...",
        image: "/images/branchesPictures/Accomodation7.jpg",
      },
    ],
    experiences: {
      highlightImage: "/images/branches/gondar-experience.jpg",
      packages: [
        {
          id: "cultural",
          title: "Cultural Experience",
          subtitle: "Discover Heritage",
          description: "Explore Gondar's rich history...",
          image: "/images/branchesPictures/Experience3.jpg",
          ctaLabel: "View Package",
        },
      ],
    },
    starRating: 4,
    seo: {
      title: "Haile Resort Gondar | Historic Luxury Stay",
      description:
        "Discover the royal heritage of Gondar with modern comforts.",
      keywords: [
        "Gondar",
        "Heritage",
        "Luxury Hotel",
        "Ethiopia",
        "Haile Resort",
      ],
    },
    location: { city: "Gondar", region: "Amhara", country: "Ethiopia" },
    published: true,
  },
};

const news = [
  {
    title: "branch opening",
    desc: "Join industry leaders in one of our 35 state-of-the-art conference halls this August.",
    detail:
      "Join industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.",
  },
  {
    title: "bahrdar",
    desc: "n industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders i",
    detail:
      "n industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.n industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.Join industry leaders in one of our 35 state-of-the-art conference halls this August.",
  },
];

async function main() {
  // write JSON copy
  fs.mkdirSync("./prisma/seeds", { recursive: true });
  fs.writeFileSync(
    "./prisma/seeds/branches.json",
    JSON.stringify(branches, null, 2)
  );

  // upsert branches
  for (const [id, b] of Object.entries(branches)) {
    await prisma.branch.upsert({
      where: { id },
      update: {
        branchName: b.branchName,
        description: b.description,
        heroImage: b.heroImage,
        directionsUrl: b.directionsUrl,
        contact: b.contact,
        attractions: b.attractions,
        accommodations: b.accommodations,
        experiences: b.experiences,
        starRating: b.starRating,
        seo: b.seo,
        location: b.location,
        published: b.published,
      },
      create: {
        id,
        branchName: b.branchName,
        description: b.description,
        heroImage: b.heroImage,
        directionsUrl: b.directionsUrl,
        contact: b.contact,
        attractions: b.attractions,
        accommodations: b.accommodations,
        experiences: b.experiences,
        starRating: b.starRating,
        seo: b.seo,
        location: b.location,
        published: b.published,
      },
    });
  }

  // replace news (clear + insert)
  await prisma.news.deleteMany();
  await prisma.news.createMany({ data: news });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
