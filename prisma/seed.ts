// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

/**
 * Inlined BRANCHES (previously in data.ts)
 * Type: Record<string, any>
 */
const BRANCHES: Record<string, any> = {
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
    heroImageAlt: "Haile Grand Addis Ababa hero",
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
    location: {
      city: "Hawassa",
      region: "Sidama",
      country: "Ethiopia",
    },
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
    location: {
      city: "Gondar",
      region: "Amhara",
      country: "Ethiopia",
    },
    published: true,
  },
};

/**
 * Keep your news & reviews seed sets as-is (or expand them)
 */
const newsData = [
  {
    title: "Branch Opening",
    desc: "Join industry leaders in one of our state-of-the-art conference halls.",
    detail:
      "Join industry leaders in one of our state-of-the-art conference halls this year. Exciting opportunities await.",
  },
];

const reviewsData = [
  { name: "Alice", text: "Great stay at Addis!", approved: true },
  { name: "Samuel", text: "Lovely lake view in Bahir Dar.", approved: true },
];

async function main() {
  // snapshot for inspection
  fs.mkdirSync("./prisma/seeds", { recursive: true });
  fs.writeFileSync(
    "./prisma/seeds/branches.json",
    JSON.stringify(BRANCHES, null, 2)
  );

  // clear existing data (delete children first) - order is important
  await prisma.package.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.branchSeo.deleteMany();
  await prisma.location.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.news.deleteMany();
  await prisma.review.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.user.deleteMany();

  // create an admin user
  const admin = await prisma.user.create({
    data: {
      name: "Seed Admin",
      email: "admin@haile.local",
      role: "ADMIN",
    },
  });

  // create branches sequentially to capture IDs for audit logs
  const createdBranches: Array<{ id: number; slug: string }> = [];

  for (const key of Object.keys(BRANCHES)) {
    const b = BRANCHES[key];

    // Map attractions (data.ts uses `id` — Prisma expects `externalId`)
    const attractionsCreate = (b.attractions || []).map((a: any) => ({
      externalId: a.id ?? a.externalId ?? null,
      label: a.label,
      image: a.image,
    }));

    // Map accommodations
    const accommodationsCreate = (b.accommodations || []).map((acc: any) => ({
      title: acc.title,
      description: acc.description ?? null,
      image: acc.image,
    }));

    // Build a single experience per branch (data.ts has experiences as an object)
    const experiencesCreate = [
      {
        externalId: `${key}-exp`,
        title: `${b.branchName} Experience`,
        description: b.experiences?.description ?? null,
        highlightImage: b.experiences?.highlightImage ?? null,
        packages: {
          create: (b.experiences?.packages || []).map((p: any) => ({
            externalId: p.id ?? p.externalId ?? null,
            title: p.title,
            subtitle: p.subtitle ?? null,
            description: p.description ?? null,
            image: p.image ?? null,
            ctaLabel: p.ctaLabel ?? null,
          })),
        },
      },
    ];

    // Create branch with nested relations
    const created = await prisma.branch.create({
      data: {
        slug: key,
        branchName: b.branchName,
        description: b.description ?? null,
        heroImage: b.heroImage ?? null,
        directionsUrl: b.directionsUrl ?? null,
        starRating: typeof b.starRating === "number" ? b.starRating : 4,
        published: typeof b.published === "boolean" ? b.published : false,

        // contact (data.ts contact has phone + email)
        contact: {
          create: {
            phone: b.contact?.phone ?? null,
            email: b.contact?.email ?? null,
            address:
              (b.location &&
                `${b.location.city}${b.location.country ? ", " + b.location.country : ""}`) ??
              null,
          },
        },

        // attractions
        attractions: {
          create: attractionsCreate,
        },

        // accommodations
        accommodations: {
          create: accommodationsCreate,
        },

        // experiences (single entry created from data.ts.experiences)
        experiences: {
          create: experiencesCreate,
        },

        // seo
        seo: {
          create: {
            title: b.seo?.title ?? `${b.branchName} | Haile Resort`,
            description: b.seo?.description ?? null,
            keywords: b.seo?.keywords ?? [],
          },
        },

        // location
        location: {
          create: {
            city: b.location?.city ?? null,
            region: b.location?.region ?? null,
            country: b.location?.country ?? null,
          },
        },
      },
    });

    createdBranches.push({ id: created.id, slug: created.slug });
  }

  // seed news & reviews
  await prisma.news.createMany({ data: newsData });
  await prisma.review.createMany({ data: reviewsData });

  // create audit logs referencing the admin and created branch ids
  for (const cb of createdBranches) {
    await prisma.auditLog.create({
      data: {
        action: "seed:create:branch",
        userId: admin.id,
        targetType: "branch",
        targetId: cb.id,
        diff: { seeded: true, slug: cb.slug },
      },
    });
  }

  console.log(
    "✅ Seed finished. Created branches:",
    createdBranches.map((b) => b.slug)
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
