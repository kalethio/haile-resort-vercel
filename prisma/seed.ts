// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.packageBooking.deleteMany();
  await prisma.roomBooking.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.loyaltyPoints.deleteMany();
  await prisma.guestFavoritePackage.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.review.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.packageMedia.deleteMany();
  await prisma.package.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.roomTypeMedia.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.websitePage.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.chatbotResponse.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.branchSeo.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  // Create Main Branch
  const mainBranch = await prisma.branch.create({
    data: {
      slug: "addis-ababa-resort",
      branchName: "Haile Addis Ababa Resort & Spa",
      description:
        "Luxury resort in the heart of Addis Ababa featuring premium accommodations, world-class dining, and exceptional service.",
      heroImage: "/images/branches/addis-hero.jpg",
      directionsUrl: "https://maps.app.goo.gl/addis-resort",
      starRating: 5,
      published: true,
      email: "addis@haileresorts.com",
      phone: "+251 11 123 4567",
      location: {
        create: {
          city: "Addis Ababa",
          region: "Addis Ababa",
          country: "Ethiopia",
        },
      },
      contact: {
        create: {
          phone: "+251 11 123 4567",
          email: "addis@haileresorts.com",
          address: "Bole Road, Addis Ababa, Ethiopia",
          socials: {
            facebook: "https://facebook.com/haileaddis",
            instagram: "https://instagram.com/haileaddis",
            twitter: "https://twitter.com/haileaddis",
          },
        },
      },
      seo: {
        create: {
          title: "Haile Addis Ababa Resort & Spa | Luxury Accommodation",
          description:
            "Experience luxury at Haile Addis Ababa Resort. Premium rooms, fine dining, and exceptional service in the heart of Ethiopia.",
          keywords: [
            "luxury hotel",
            "addis ababa",
            "resort",
            "spa",
            "ethiopia",
          ],
        },
      },
    },
  });

  // Create Arba Minch Branch
  const arbaMinchBranch = await prisma.branch.create({
    data: {
      slug: "arba-minch-resort",
      branchName: "Haile Arba Minch Resort",
      description:
        "Stunning lakeside resort overlooking Lake Chamo and Lake Abaya, offering unique nature experiences and cultural tours.",
      heroImage: "/images/branches/arba-minch-hero.jpg",
      directionsUrl: "https://maps.app.goo.gl/arba-minch-resort",
      starRating: 4,
      published: true,
      email: "arbaminch@haileresorts.com",
      phone: "+251 46 881 2345",
      location: {
        create: {
          city: "Arba Minch",
          region: "Southern Nations",
          country: "Ethiopia",
        },
      },
      contact: {
        create: {
          phone: "+251 46 881 2345",
          email: "arbaminch@haileresorts.com",
          address: "Lake Shore Road, Arba Minch, Ethiopia",
          socials: {
            facebook: "https://facebook.com/hailearbaminch",
            instagram: "https://instagram.com/hailearbaminch",
          },
        },
      },
    },
  });

  // Create Admin Users
  await prisma.user.createMany({
    data: [
      {
        name: "Super Admin",
        email: "admin@haileresorts.com",
        role: "SUPER_ADMIN",
        branchId: mainBranch.id,
      },
      {
        name: "Addis Manager",
        email: "manager.addis@haileresorts.com",
        role: "MANAGER",
        branchId: mainBranch.id,
      },
      {
        name: "Arba Minch Manager",
        email: "manager.arbaminch@haileresorts.com",
        role: "MANAGER",
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create Room Types
  const roomTypes = await prisma.roomType.createMany({
    data: [
      {
        name: "Deluxe King Room",
        description:
          "Spacious room with king bed, city view, and luxury amenities",
        capacity: 2,
        childrenCapacity: 1,
        basePrice: 250.0,
        amenities: ["WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV"],
        available: true,
        totalRooms: 10,
        branchId: mainBranch.id,
      },
      {
        name: "Executive Suite",
        description:
          "Luxury suite with separate living area and premium services",
        capacity: 3,
        childrenCapacity: 2,
        basePrice: 450.0,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Mini Bar",
          "Safe",
          "TV",
          "Jacuzzi",
          "Balcony",
        ],
        available: true,
        totalRooms: 5,
        branchId: mainBranch.id,
      },
      {
        name: "Lakeside Villa",
        description:
          "Private villa with stunning lake views and exclusive access",
        capacity: 4,
        childrenCapacity: 2,
        basePrice: 650.0,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Private Pool",
          "Kitchen",
          "Garden",
        ],
        available: true,
        totalRooms: 3,
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create Experiences with Packages for Addis Ababa
  const addisExperiences = await prisma.experience.createMany({
    data: [
      {
        title: "Cultural City Tour",
        description:
          "Explore the rich history and culture of Addis Ababa with our expert guides",
        highlightImage: "/images/experiences/addis-city-tour.jpg",
        branchId: mainBranch.id,
      },
      {
        title: "Luxury Spa Retreat",
        description:
          "Indulge in our premium spa treatments and wellness programs",
        highlightImage: "/images/experiences/spa-retreat.jpg",
        branchId: mainBranch.id,
      },
      {
        title: "Fine Dining Experience",
        description:
          "Exquisite culinary journey featuring Ethiopian and international cuisine",
        highlightImage: "/images/experiences/fine-dining.jpg",
        branchId: mainBranch.id,
      },
    ],
  });

  // Get created experiences to assign packages
  const experiences = await prisma.experience.findMany({
    where: { branchId: mainBranch.id },
  });

  const culturalTour = experiences.find(
    (e) => e.title === "Cultural City Tour"
  );
  const spaRetreat = experiences.find((e) => e.title === "Luxury Spa Retreat");
  const fineDining = experiences.find(
    (e) => e.title === "Fine Dining Experience"
  );

  // Create Packages for Addis Ababa Branch
  await prisma.package.createMany({
    data: [
      // Cultural Tour Packages
      {
        title: "Half-Day City Explorer",
        subtitle: "Morning cultural immersion",
        description:
          "Visit the National Museum, Holy Trinity Cathedral, and Mercato market with our knowledgeable guides. Includes transportation and entrance fees.",
        image: "/images/packages/city-explorer.jpg",
        price: 75.0,
        duration: "4 hours",
        inclusions: [
          "Expert guide",
          "Transportation",
          "Entrance fees",
          "Bottled water",
        ],
        category: "CULTURAL",
        available: true,
        ctaLabel: "Book City Tour",
        branchId: mainBranch.id,
        experienceId: culturalTour?.id,
      },
      {
        title: "Full-Day Heritage Tour",
        subtitle: "Complete Addis Ababa experience",
        description:
          "Comprehensive tour covering all major historical and cultural sites including Ethnographic Museum and Mount Entoto with traditional lunch included.",
        image: "/images/packages/heritage-tour.jpg",
        price: 150.0,
        duration: "8 hours",
        inclusions: [
          "Expert guide",
          "Transportation",
          "All entrance fees",
          "Traditional lunch",
          "Souvenir",
        ],
        category: "CULTURAL",
        available: true,
        ctaLabel: "Book Heritage Tour",
        branchId: mainBranch.id,
        experienceId: culturalTour?.id,
      },

      // Spa Retreat Packages
      {
        title: "Couples Spa Escape",
        subtitle: "Romantic wellness journey",
        description:
          "Indulge in a luxurious couples spa experience with side-by-side treatments, private jacuzzi access, and champagne celebration.",
        image: "/images/packages/couples-spa.jpg",
        price: 200.0,
        duration: "3 hours",
        inclusions: [
          "Couples massage",
          "Private jacuzzi",
          "Champagne",
          "Fruit platter",
          "Rose petals",
        ],
        category: "ROMANTIC",
        available: true,
        ctaLabel: "Book Spa Escape",
        branchId: mainBranch.id,
        experienceId: spaRetreat?.id,
      },
      {
        title: "Family Wellness Day",
        subtitle: "Fun for the whole family",
        description:
          "Specialized treatments for all ages including kids massage, family yoga session, and healthy lunch options.",
        image: "/images/packages/family-wellness.jpg",
        price: 180.0,
        duration: "4 hours",
        inclusions: [
          "Kids treatments",
          "Family yoga",
          "Healthy lunch",
          "Pool access",
          "Games",
        ],
        category: "FAMILY",
        available: true,
        ctaLabel: "Book Family Day",
        branchId: mainBranch.id,
        experienceId: spaRetreat?.id,
      },

      // Fine Dining Packages
      {
        title: "Romantic Candlelight Dinner",
        subtitle: "Intimate dining experience",
        description:
          "Private candlelit dinner with personalized menu, live traditional music, and breathtaking city views from our rooftop restaurant.",
        image: "/images/packages/romantic-dinner.jpg",
        price: 120.0,
        duration: "2.5 hours",
        inclusions: [
          "5-course meal",
          "Wine pairing",
          "Live music",
          "Private table",
          "City views",
        ],
        category: "ROMANTIC",
        available: true,
        ctaLabel: "Book Romantic Dinner",
        branchId: mainBranch.id,
        experienceId: fineDining?.id,
      },
    ],
  });

  // Create Standalone Packages for Arba Minch (not linked to experiences)
  await prisma.package.createMany({
    data: [
      {
        title: "Crocodile Market Boat Tour",
        subtitle: "Wildlife adventure on Lake Chamo",
        description:
          "Exciting boat tour to see crocodiles, hippos, and diverse bird species in their natural habitat with experienced guides.",
        image: "/images/packages/crocodile-tour.jpg",
        price: 65.0,
        duration: "3 hours",
        inclusions: [
          "Boat ride",
          "Expert guide",
          "Safety equipment",
          "Binoculars",
          "Refreshments",
        ],
        category: "NATURE",
        available: true,
        ctaLabel: "Book Boat Tour",
        branchId: arbaMinchBranch.id,
      },
      {
        title: "Nechisar National Park Safari",
        subtitle: "Full-day wildlife exploration",
        description:
          "Guided safari through Nechisar National Park to spot zebras, gazelles, and various bird species with picnic lunch in the wilderness.",
        image: "/images/packages/nechisar-safari.jpg",
        price: 95.0,
        duration: "7 hours",
        inclusions: [
          "4x4 vehicle",
          "Park fees",
          "Expert guide",
          "Picnic lunch",
          "Photography tips",
        ],
        category: "NATURE",
        available: true,
        ctaLabel: "Book Safari",
        branchId: arbaMinchBranch.id,
      },
      {
        title: "Cultural Village Experience",
        subtitle: "Authentic tribal immersion",
        description:
          "Visit local Dorze and Gamo villages to learn about traditional crafts, music, and way of life with hands-on activities.",
        image: "/images/packages/village-experience.jpg",
        price: 55.0,
        duration: "5 hours",
        inclusions: [
          "Village visits",
          "Cultural activities",
          "Traditional lunch",
          "Local guide",
          "Craft demonstration",
        ],
        category: "CULTURAL",
        available: true,
        ctaLabel: "Book Village Tour",
        branchId: arbaMinchBranch.id,
      },
      {
        title: "Family Fishing Adventure",
        subtitle: "Fun fishing experience for all ages",
        description:
          "Guided fishing trip on Lake Abaya with equipment provided. Perfect for families wanting to experience local fishing traditions.",
        image: "/images/packages/family-fishing.jpg",
        price: 70.0,
        duration: "4 hours",
        inclusions: [
          "Fishing equipment",
          "Boat rental",
          "Fishing guide",
          "Snacks",
          "Fish cleaning",
        ],
        category: "FAMILY",
        available: true,
        ctaLabel: "Book Fishing Trip",
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create Attractions
  await prisma.attraction.createMany({
    data: [
      {
        label: "Infinity Pool",
        image: "/images/attractions/infinity-pool.jpg",
        branchId: mainBranch.id,
      },
      {
        label: "Rooftop Bar",
        image: "/images/attractions/rooftop-bar.jpg",
        branchId: mainBranch.id,
      },
      {
        label: "Lake View Restaurant",
        image: "/images/attractions/lake-restaurant.jpg",
        branchId: arbaMinchBranch.id,
      },
      {
        label: "Nature Trail",
        image: "/images/attractions/nature-trail.jpg",
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create Accommodations
  await prisma.accommodation.createMany({
    data: [
      {
        title: "Luxury Suite",
        description:
          "Spacious suite with panoramic city views and premium amenities",
        image: "/images/accommodations/luxury-suite.jpg",
        branchId: mainBranch.id,
      },
      {
        title: "Executive Room",
        description: "Comfortable room with workspace and modern facilities",
        image: "/images/accommodations/executive-room.jpg",
        branchId: mainBranch.id,
      },
      {
        title: "Lakeside Bungalow",
        description:
          "Private bungalow with direct lake access and outdoor seating",
        image: "/images/accommodations/lakeside-bungalow.jpg",
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Alem Tesfaye",
        position: "General Manager",
        bio: "With over 15 years in hospitality management, Alem ensures exceptional guest experiences.",
        image: "/images/team/alem-tesfaye.jpg",
        order: 1,
        published: true,
        branchId: mainBranch.id,
      },
      {
        name: "Meron Getachew",
        position: "Head Chef",
        bio: "Award-winning chef specializing in Ethiopian fusion cuisine with international flair.",
        image: "/images/team/meron-getachew.jpg",
        order: 2,
        published: true,
        branchId: mainBranch.id,
      },
      {
        name: "Samuel Bekele",
        position: "Adventure Guide",
        bio: "Local expert with extensive knowledge of Southern Ethiopia wildlife and culture.",
        image: "/images/team/samuel-bekele.jpg",
        order: 1,
        published: true,
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  // Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "What time is check-in and check-out?",
        answer:
          "Check-in is from 2:00 PM and check-out is until 12:00 PM. Early check-in and late check-out may be available upon request.",
        category: "Accommodation",
        order: 1,
        published: true,
        branchId: mainBranch.id,
      },
      {
        question: "Do you offer airport transfers?",
        answer:
          "Yes, we provide airport transfer services. Please contact our concierge at least 24 hours before your arrival.",
        category: "Transportation",
        order: 2,
        published: true,
        branchId: mainBranch.id,
      },
      {
        question: "Are pets allowed?",
        answer:
          "We welcome pets in designated rooms. Additional charges and policies apply. Please contact us for details.",
        category: "Policies",
        order: 3,
        published: true,
        branchId: mainBranch.id,
      },
    ],
  });

  // Create Promo Codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: "WELCOME20",
        description: "Welcome discount for first-time guests",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minimumAmount: 100,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
        usageLimit: 100,
        usedCount: 25,
        active: true,
        branchId: mainBranch.id,
      },
      {
        code: "FAMILY15",
        description: "Family package discount",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minimumAmount: 200,
        validFrom: new Date("2024-01-01"),
        validUntil: new Date("2024-12-31"),
        usageLimit: 50,
        usedCount: 12,
        active: true,
        branchId: arbaMinchBranch.id,
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - 2 Branches`);
  console.log(`   - ${experiences.length} Experiences`);
  console.log(`   - Multiple Packages with categories`);
  console.log(`   - Team Members, FAQs, and Promo Codes`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
