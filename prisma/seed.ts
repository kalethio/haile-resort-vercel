// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  try {
    // 1. Create SUPER_ADMIN Role & Permissions
    console.log("👑 Creating SUPER_ADMIN role...");
    await createSuperAdminRole();

    // 2. Create Branches with accurate data
    console.log("🏨 Creating branches...");
    const branches = await createBranches();

    // 3. Create SUPER_ADMIN User
    console.log("👥 Creating SUPER_ADMIN user...");
    await createSuperAdminUser();

    // 4. Create Room Types for each branch
    console.log("🛏️ Creating room types...");
    await createRoomTypes(branches);

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// ============================
// 1. SUPER_ADMIN FUNCTIONS
// ============================
async function createSuperAdminRole() {
  // Clear existing roles and permissions first
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  // Create SUPER_ADMIN role
  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPER_ADMIN",
      description: "Full system access - cannot be deleted",
      isSystem: true,
    },
  });

  // Use the permission keys that sidebar expects
  const permissionModules = [
    "reservations",
    "room_management",
    "content_management",
    "hr_management",
    "inventory",
    "cms_branch_manager",
    "cms_review",
    "cms_chatbot",
    "cms_news",
    "email_marketing",
    "system_users",
    "system_roles",
    "system_api",
    "system_audit",
  ];

  // Create 'view' permissions for each module
  const permissionPromises = permissionModules.map((moduleName) =>
    prisma.permission.create({
      data: {
        module: moduleName,
        action: "view",
        roleId: superAdminRole.id,
      },
    })
  );

  await Promise.all(permissionPromises);
  console.log(`✅ Created SUPER_ADMIN role with ${permissionModules.length} module permissions`);
  return superAdminRole;
}

async function createSuperAdminUser() {
  const email = "superadmin@haileresorts.com";

  // Check if SUPER_ADMIN user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log("✅ SUPER_ADMIN user already exists");
    return existingUser;
  }

  // Get SUPER_ADMIN role
  const superAdminRole = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN" },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found. Run createSuperAdminRole first.");
  }

  // Create SUPER_ADMIN user with a secure password (hash for 'Admin@123')
  const user = await prisma.user.create({
    data: {
      name: "Super Administrator",
      email,
      password: "$2a$12$LQv3c1yqBWVHxkdU8ICkCOZ0sKZAn5r.8HjLMZGTPjB3YPHM7qG0a",
      roleId: superAdminRole.id,
      status: "ACTIVE",
    },
  });

  console.log(`✅ Created SUPER_ADMIN user: ${email}`);
  return user;
}

// ============================
// 2. BRANCH CREATION FUNCTION
// ============================
async function createBranches() {
  console.log("🏨 Creating branches and related data...");

  // Check if branches already exist to avoid duplicates
  const existingBranches = await prisma.branch.findMany();
  if (existingBranches.length > 0) {
    console.log("✅ Branches already exist, skipping creation");
    return existingBranches;
  }

  // Universal hero tagline for all branches
  const UNIVERSAL_TAGLINE = "Turn your dream into Reality";

  // Data for ALL branches
  const branchesData = [
    // Haile Grand Addis Ababa
    {
      slug: "addis-ababa",
      branchName: "Haile Grand Addis Ababa",
      description: "Addis Ababa, Ethiopia's bustling capital nestled in the highlands near the Great Rift Valley, remains the country's vibrant commercial and cultural center.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
      email: "addis@haileresorts.com",
      phone: "+251 11 552 1234",
      starRating: 5,
      directionsUrl: "https://maps.google.com/?q=Haile+Grand+Addis+Ababa",
      heroVideoUrl: "https://example.com/videos/addis-overview.mp4",
      published: true,
      attractions: [
        { label: "National Museum", order: 1 },
        { label: "Holy Trinity Cathedral", order: 2 },
        { label: "Entoto Hill", order: 3 },
        { label: "Science Museum", order: 4 },
        { label: "Addis Ababa Museum", order: 5 },
        { label: "Merkato Market", order: 6 },
        { label: "Shiromeda Market", order: 7 },
        { label: "Mount Entoto", order: 8 },
        { label: "Unity Park", order: 9 },
      ],
    },
    // Haile Resort Hawassa
    {
      slug: "hawassa",
      branchName: "Haile Resort Hawassa",
      description: "Situated along the picturesque shores of Lake Hawassa, offering breathtaking views that harmonize the area's rich cultural mosaic with renowned southern hospitality.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Hawassa",
      region: "Sidama",
      country: "Ethiopia",
      email: "hawassa@haileresorts.com",
      phone: "+251 46 220 1234",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Hawassa",
      heroVideoUrl: "https://example.com/videos/hawassa-lake.mp4",
      published: true,
      attractions: [
        { label: "Tabor Mountain", order: 1 },
        { label: "Saint Gabriel Church", order: 2 },
        { label: "Fiche Chembelala (Sidama New Year)", order: 3 },
        { label: "Lake Hawassa", order: 4 },
        { label: "Fish Market (Asa Gebeya)", order: 5 },
        { label: "Hawassa University Campus and Botanical Garden", order: 6 },
        { label: "Amora Gedel Park", order: 7 },
      ],
    },
    // Haile Resort Arba Minch
    {
      slug: "arba-minch",
      branchName: "Haile Resort Arba Minch",
      description: "Luxurious four-star resort overlooking the twin lakes of Abaya and Chamo, featuring 107 elegantly appointed rooms with spectacular views of Nechisar National Park.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Arba Minch",
      region: "Southern Nations",
      country: "Ethiopia",
      email: "arbaminch@haileresorts.com",
      phone: "+251 46 881 1234",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Arba+Minch",
      heroVideoUrl: "https://example.com/videos/arba-minch-park.mp4",
      published: true,
      attractions: [
        { label: "Arba Minch Eco Campsite", order: 1 },
        { label: "Boat ride to Nech Sar National Park", order: 2 },
        { label: "Crocodile market", order: 3 },
        { label: "Forty Springs", order: 4 },
        { label: "Nile Crocodile Ranch", order: 5 },
        { label: "Dorze Village", order: 6 },
        { label: "Konso (UNESCO World Heritage)", order: 7 },
      ],
    },
    // Haile Resort Adama
    {
      slug: "adama",
      branchName: "Haile Resort Adama",
      description: "Located at the crossroads connecting to the Port of Djibouti, serving as a vibrant industrial, commercial, and conference hub in one of Ethiopia's fastest-growing cities.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Adama",
      region: "Oromia",
      country: "Ethiopia",
      email: "adama@haileresorts.com",
      phone: "+251 22 123 4567",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Adama",
      heroVideoUrl: "https://example.com/videos/adama-city.mp4",
      published: true,
      attractions: [
        { label: "Adama Science and Technology University", order: 1 },
        { label: "OBO Park", order: 2 },
        { label: "Abagada Park", order: 3 },
        { label: "Manid Lake and nearby waterfalls", order: 4 },
      ],
    },
    // Haile Hotel Wolaita
    {
      slug: "wolaita",
      branchName: "Haile Hotel Wolaita",
      description: "Four-star establishment in the heart of downtown Sodo, providing convenient access to the city's main attractions and nearby cultural and historical sites.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Wolaita Sodo",
      region: "South Ethiopia",
      country: "Ethiopia",
      email: "wolaita@haileresorts.com",
      phone: "+251 46 234 5678",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Hotel+Wolaita",
      heroVideoUrl: "https://example.com/videos/wolaita-overview.mp4",
      published: true,
      attractions: [
        { label: "Ajora Twin Waterfalls", order: 1 },
        { label: "Wolaita Sodo University Museum", order: 2 },
        { label: "Mount Damota", order: 3 },
      ],
    },
    // Haile Resort Gondar
    {
      slug: "gonder",
      branchName: "Haile Resort Gondar",
      description: "Experience the 'Camelot of Africa' with easy access to the UNESCO World Heritage Site of Fasil Ghebbi and the breathtaking Simien Mountains National Park.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Gondar",
      region: "Amhara",
      country: "Ethiopia",
      email: "gonder@haileresorts.com",
      phone: "+251 58 114 1234",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Gondar",
      heroVideoUrl: "https://example.com/videos/gondar-castles.mp4",
      published: true,
      attractions: [
        { label: "Fasilides Castle", order: 1 },
        { label: "Church of Debre Berhan Selassie", order: 2 },
        { label: "Simien Mountain", order: 3 },
        { label: "Traditional Nightlife", order: 4 },
        { label: "Market (Kidame Gebeya)", order: 5 },
      ],
    },
    // Haile Resort Batu
    {
      slug: "batu",
      branchName: "Haile Resort Batu",
      description: "Renowned for Lake Ziway, the largest of the northern Rift Valley lakes, known for its prolific birdlife, hippopotamus populations, and ancient island monasteries.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Batu (Ziway)",
      region: "Oromia",
      country: "Ethiopia",
      email: "batu@haileresorts.com",
      phone: "+251 22 345 6789",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Batu",
      heroVideoUrl: "https://example.com/videos/batu-lake.mp4",
      published: true,
      attractions: [
        { label: "Lake Langano", order: 1 },
        { label: "Abijatta-Shalla lakes National Park", order: 2 },
        { label: "Hippos", order: 3 },
        { label: "Islands on the lake of Ziway", order: 4 },
        { label: "Birds", order: 5 },
        { label: "Castel winery farm & factory", order: 6 },
        { label: "Boating and fishing", order: 7 },
      ],
    },
    // Haile Village Sululta
    {
      slug: "sululta",
      branchName: "Haile Village Sululta",
      description: "High-altitude athletics village at 2,752 meters above sea level, offering Olympic-standard facilities for athletes and modern spaces for conference tourism.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Sululta",
      region: "Oromia",
      country: "Ethiopia",
      email: "sululta@haileresorts.com",
      phone: "+251 11 987 6543",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Village+Sululta",
      heroVideoUrl: "https://example.com/videos/sululta-village.mp4",
      published: true,
      attractions: [
        { label: "Sululta Plain", order: 1 },
        { label: "Gullele Botanic Garden", order: 2 },
        { label: "Haile Museum", order: 3 },
        { label: "Entoto trekking routes", order: 4 },
      ],
    },
    // Haile Resort Jimma
    {
      slug: "jimma",
      branchName: "Haile Resort Jimma",
      description: "Elegant four-star retreat in the heart of Ethiopia's historic coffee capital, offering panoramic views and modern accommodations with personalized service.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Jimma",
      region: "Oromia",
      country: "Ethiopia",
      email: "jimma@haileresorts.com",
      phone: "+251 47 111 2233",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Resort+Jimma",
      heroVideoUrl: "https://example.com/videos/jimma-coffee.mp4",
      published: true,
      attractions: [
        { label: "Aba Jiffar Palace", order: 1 },
        { label: "Saka Waterfall", order: 2 },
        { label: "Visiting the Birthplace of Coffee", order: 3 },
        { label: "Chebera Churchura National Park", order: 4 },
      ],
    },
    // Haile Hotel Shashemene
    {
      slug: "shashemene",
      branchName: "Haile Hotel Shashemene",
      description: "Gateway to the stunning lakes of Hawassa and Langano, offering a lively multicultural atmosphere with bustling local markets and access to natural wonders.",
      heroTagline: UNIVERSAL_TAGLINE,
      city: "Shashemene",
      region: "Oromia",
      country: "Ethiopia",
      email: "shashemene@haileresorts.com",
      phone: "+251 46 555 6677",
      starRating: 4,
      directionsUrl: "https://maps.google.com/?q=Haile+Hotel+Shashemene",
      heroVideoUrl: "https://example.com/videos/shashemene-market.mp4",
      published: true,
      attractions: [
        { label: "Shashemene Market", order: 1 },
      ],
    },
  ];

  const createdBranches = [];

  for (const data of branchesData) {
    // 1. Create the main Branch record
    const branch = await prisma.branch.create({
      data: {
        slug: data.slug,
        branchName: data.branchName,
        description: data.description,
        heroTagline: data.heroTagline,
        directionsUrl: data.directionsUrl,
        heroVideoUrl: data.heroVideoUrl,
        starRating: data.starRating,
        published: data.published,
        email: data.email,
        phone: data.phone,
      },
    });

    // 2. Create the related Location record
    await prisma.location.create({
      data: {
        city: data.city,
        region: data.region,
        country: data.country,
        branchId: branch.id,
      },
    });

    // 3. Create SEO-optimized BranchSeo record
    await prisma.branchSeo.create({
      data: {
        title: `${data.branchName} | Haile Hotels & Resorts`,
        description: `Book your stay at ${data.branchName} in ${data.city}, ${data.region}. ${data.description.substring(0, 150)}...`,
        keywords: [
          `${data.city} hotel`,
          `${data.region} resort`,
          "Ethiopia accommodation",
          "luxury stay Ethiopia",
          `hotel in ${data.city}`,
          `${data.branchName} booking`,
        ],
        branchId: branch.id,
      },
    });

    // 4. Create the Contact record
    await prisma.contact.create({
      data: {
        phone: data.phone,
        email: data.email,
        address: `${data.city}, ${data.region}, ${data.country}`,
        socials: {
          facebook: `https://facebook.com/haile${data.slug}`,
          instagram: `https://instagram.com/haile${data.slug}`,
          twitter: `https://twitter.com/haile${data.slug}`,
        },
        branchId: branch.id,
      },
    });

    // 5. Create Attraction records for this branch
    if (data.attractions && data.attractions.length > 0) {
      const attractionPromises = data.attractions.map((att) =>
        prisma.attraction.create({
          data: {
            label: att.label,
            order: att.order,
            branchId: branch.id,
          },
        })
      );
      await Promise.all(attractionPromises);
    }

    createdBranches.push(branch);
    console.log(`✅ Created branch: ${data.branchName} with ${data.attractions?.length || 0} attractions`);
  }

  console.log(`✅ Created ${createdBranches.length} branches with full details.`);
  return createdBranches;
}

// ============================
// 3. ROOM TYPE CREATION FUNCTION
// ============================
async function createRoomTypes(branches: any[]) {
  console.log("🛏️ Creating room types for each branch...");

  // Map branch names to branch objects for easy lookup
  const branchMap = new Map();
  branches.forEach(branch => {
    branchMap.set(branch.branchName, branch);
  });

  // Room type data from your Excel table
  const roomTypeData = [
    // Haile Grand Addis Ababa rooms
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Classic Queen Room (CQR)",
      description: "Classic queen room with modern amenities and comfortable stay",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 145, // Using Website Rate
      totalRooms: 113,
      available: true,
      amenities: ["42\" HD satellite TV", "Wi-Fi", "central cooling and heating", "smoke detector", "electric kettle", "ironing facilities", "hair dryer", "wireless charger", "minibar", "safe box", "shoehorn", "wake-up service", "gym access", "pool access", "parking", "24hr doctor", "airport transfer"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Classic King Room (CKR)",
      description: "Classic king room with spacious layout",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 145,
      totalRooms: 4,
      available: true,
      amenities: ["42\" HD satellite TV", "Wi-Fi", "central cooling and heating", "smoke detector", "electric kettle", "ironing facilities", "hair dryer", "wireless charger", "minibar", "safe box"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Classic Twin Room (CTR)",
      description: "Classic twin room with two separate beds",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 145,
      totalRooms: 13,
      available: true,
      amenities: ["42\" HD satellite TV", "Wi-Fi", "central cooling and heating", "smoke detector", "electric kettle", "ironing facilities", "hair dryer", "wireless charger", "minibar", "safe box"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Premium King Room (PKR)",
      description: "Premium king room with extra space and luxury amenities",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 154,
      totalRooms: 12,
      available: true,
      amenities: ["42\" HD satellite TV", "Wi-Fi", "central cooling and heating", "smoke detector", "electric kettle", "ironing facilities", "hair dryer", "wireless charger", "minibar", "safe box", "reading light", "shoe shine pad"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Premium Suite (PST)",
      description: "Premium suite with living room and kitchen area",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 223,
      totalRooms: 6,
      available: true,
      amenities: ["42\" HD TV", "Wi-Fi", "central cooling/heating", "smoke detector", "kettle", "iron", "hair dryer", "wireless charger", "reading light", "minibar", "safe", "scale", "shoe horn", "shoe shine pad", "wake-up service", "gym", "pool", "airport transfer", "24hr doctor", "living room with kitchen"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Grand Premium Suite (GSR)",
      description: "Grand premium suite with spacious living area",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 273,
      totalRooms: 5,
      available: true,
      amenities: ["42\" HD TV", "Wi-Fi", "central cooling/heating", "smoke detector", "kettle", "iron", "hair dryer", "wireless charger", "minibar", "safe", "scale", "shoe horn", "shoe shine pad", "wake-up service", "gym", "pool", "airport transfer"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Family Suite Room (FSUI)",
      description: "Family suite perfect for families with children",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 348,
      totalRooms: 3,
      available: true,
      amenities: ["42\" HD TV", "Wi-Fi", "central cooling/heating", "smoke detector", "kettle", "iron", "hair dryer", "wireless charger", "minibar", "safe", "scale", "shoe horn", "shoe shine pad", "wake-up service", "gym", "pool", "airport transfer"]
    },
    {
      branchName: "Haile Grand Addis Ababa",
      name: "Presidential Suite (GPS)",
      description: "Luxurious presidential suite with premium amenities",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 600,
      totalRooms: 1,
      available: true,
      amenities: ["42\" HD TV", "Wi-Fi", "central cooling/heating", "smoke detector", "kettle", "iron", "hair dryer", "wireless charger", "minibar", "safe", "scale", "shoe horn", "shoe shine pad", "wake-up service", "gym", "pool", "airport transfer", "24hr butler service", "private dining"]
    },
    
    // Haile Resort Hawassa rooms
    {
      branchName: "Haile Resort Hawassa",
      name: "Standard Ground Room",
      description: "Standard room on ground floor with garden access",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 130,
      totalRooms: 7,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Queen Classic Garden View (CQGV)",
      description: "Queen room with beautiful garden view",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 140,
      totalRooms: 26,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Queen Memorable Lake View (QMLV)",
      description: "Queen room with stunning lake view",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 157,
      totalRooms: 37,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Twin Garden View (TWNGV)",
      description: "Twin room with garden view",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 157,
      totalRooms: 19,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Double Apartment (DBLAPT)",
      description: "Double apartment with separate living area",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 250,
      totalRooms: 4,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board", "kitchenette"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Family Apartment (FAMAPT)",
      description: "Spacious family apartment",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 297,
      totalRooms: 10,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board", "kitchenette"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Family Garden View (FAMGV) Inter-connected",
      description: "Inter-connected family rooms with garden view",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 297,
      totalRooms: 12,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Family Lake View (FAMLV)",
      description: "Family room with lake view",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 297,
      totalRooms: 3,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Suite (DLXSUI)",
      description: "Deluxe suite with separate living area",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 250,
      totalRooms: 7,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board", "separate living room"]
    },
    {
      branchName: "Haile Resort Hawassa",
      name: "Presidential Suite (PSUI)",
      description: "Luxurious presidential suite",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 495,
      totalRooms: 1,
      available: true,
      amenities: ["flat-screen TV", "tea/coffee maker", "hair dryer", "ironing board", "separate living room", "dining area", "kitchenette", "butler service"]
    },
    
    // Haile Resort Jimma rooms (as example - add more as needed)
    {
      branchName: "Haile Resort Jimma",
      name: "Classic Queen Room (CQR)",
      description: "Classic queen room with private balcony",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 40,
      totalRooms: 91,
      available: true,
      amenities: ["queen bed", "tea bath amenities", "mini-refrigerator", "hair dryer", "digital safe box", "AC", "Wi-Fi", "43\" LCD TV", "private balcony"]
    },
    {
      branchName: "Haile Resort Jimma",
      name: "Classic Twin Room (CTR)",
      description: "Classic twin room with private balcony",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 55,
      totalRooms: 4,
      available: true,
      amenities: ["twin beds", "tea bath amenities", "mini-refrigerator", "hair dryer", "digital safe box", "AC", "Wi-Fi", "43\" LCD TV", "private balcony"]
    },
    {
      branchName: "Haile Resort Jimma",
      name: "Family Room (FAM)",
      description: "Spacious family room with queen and two single beds",
      capacity: 4,
      childrenCapacity: 2,
      basePrice: 100,
      totalRooms: 4,
      available: true,
      amenities: ["queen + two single beds", "digital safe", "mini-fridge", "hair dryer", "tea bath amenities", "AC", "Wi-Fi", "43\" TV", "private balcony"]
    },
    {
      branchName: "Haile Resort Jimma",
      name: "Premium Suite (PSUI)",
      description: "Premium suite with master bedroom and living room",
      capacity: 2,
      childrenCapacity: 0,
      basePrice: 90,
      totalRooms: 5,
      available: true,
      amenities: ["master bedroom with king bed", "living room", "spacious shower", "mini-fridge", "hair dryer", "tea amenities", "digital safe", "AC", "Wi-Fi", "43\" TV", "private balcony"]
    },
    
    // Add more room types for other branches here following the same pattern
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const roomData of roomTypeData) {
    const branch = branchMap.get(roomData.branchName);
    
    if (!branch) {
      console.log(`⚠️ Skipping room type "${roomData.name}" - Branch "${roomData.branchName}" not found`);
      skippedCount++;
      continue;
    }

    try {
      // Check if room type already exists for this branch
      const existingRoomType = await prisma.roomType.findFirst({
        where: {
          name: roomData.name,
          branchId: branch.id,
        },
      });

      if (existingRoomType) {
        console.log(`✅ Room type already exists: ${roomData.name} for ${roomData.branchName}`);
        skippedCount++;
        continue;
      }

      // Create the room type
      await prisma.roomType.create({
        data: {
          name: roomData.name,
          description: roomData.description,
          capacity: roomData.capacity,
          childrenCapacity: roomData.childrenCapacity,
          basePrice: roomData.basePrice,
          totalRooms: roomData.totalRooms,
          available: roomData.available,
          amenities: roomData.amenities,
          branchId: branch.id,
        },
      });

      createdCount++;
      console.log(`✅ Created room type: ${roomData.name} for ${roomData.branchName}`);
    } catch (error) {
      console.error(`❌ Failed to create room type "${roomData.name}" for ${roomData.branchName}:`, error);
      skippedCount++;
    }
  }

  console.log(`📊 Room types: ${createdCount} created, ${skippedCount} skipped`);
}

// ============================
// EXECUTE SEED
// ============================
main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
