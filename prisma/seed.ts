// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔴 DEBUG: Seed started");

  try {
    // Test 1: Check database connection
    console.log("🔴 Step 1: Testing database connection...");
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection OK");

    // Test 2: Check if JobOpening table exists
    console.log("🔴 Step 2: Checking JobOpening table...");
    const tableCheck = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='JobOpening'
    `;
    console.log("✅ JobOpening table exists:", tableCheck);

    // Test 3: Check current JobOpening count
    console.log("🔴 Step 3: Checking current JobOpening count...");
    const currentCount = await prisma.jobOpening.count();
    console.log("📊 Current JobOpening count:", currentCount);

    // Test 4: Check if we can create branches
    console.log("🔴 Step 4: Creating branches...");
    const branches = await createBranches();
    console.log(
      "✅ Created branches:",
      branches.map((b) => b.id)
    );

    // Test 5: Try to create ONE simple job
    console.log("🔴 Step 5: Testing job creation...");
    const testJob = await prisma.jobOpening.create({
      data: {
        title: "DEBUG TEST JOB",
        department: "Debug",
        description: "This is a test job for debugging",
        location: "Test Location",
        type: "Full-time",
        published: true,
        branchId: branches[0].id,
      },
    });
    console.log("✅ Test job created successfully! ID:", testJob.id);

    // Test 6: Check if job appears in database
    console.log("🔴 Step 6: Verifying job in database...");
    const verifyJob = await prisma.jobOpening.findFirst({
      where: { id: testJob.id },
    });
    console.log("✅ Job verified in DB:", !!verifyJob);

    // Test 7: Now try the actual job creation function
    console.log("🔴 Step 7: Calling createJobOpenings function...");
    await createJobOpenings(branches);

    // Test 8: Final count check
    console.log("🔴 Step 8: Final count check...");
    const finalCount = await prisma.jobOpening.count();
    console.log("📊 Final JobOpening count:", finalCount);

    console.log("✅ DEBUG COMPLETED - All tests passed");
  } catch (error) {
    console.error("❌ DEBUG FAILED at step:", error);
    console.error("Full error details:", error);
  }
}

async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  // Clear in correct order to respect foreign key constraints
  await prisma.auditLog.deleteMany();
  await prisma.loyaltyPoints.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.roomBooking.deleteMany();
  await prisma.packageBooking.deleteMany();
  await prisma.guestFavoritePackage.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.packageMedia.deleteMany();
  await prisma.roomTypeMedia.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.package.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.review.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.websitePage.deleteMany();
  await prisma.chatbotResponse.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.location.deleteMany();
  await prisma.branchSeo.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.accommodation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
}

async function createBranches() {
  console.log("🏨 Creating branches...");

  // Check if branches already exist
  const existingBranches = await prisma.branch.findMany();
  if (existingBranches.length > 0) {
    console.log("✅ Branches already exist, skipping creation");
    return existingBranches;
  }

  const branches = [];

  const branchData = [
    {
      slug: "hawassa",
      branchName: "Hawassa",
      description: "Beautiful lakeside resort on the shores of Lake Hawassa",
      heroImage: "/uploads/branches/branch01.jpg",
      directionsUrl: "https://maps.google.com/?q=Haile+Hawassa+Resort",
      starRating: 4,
      email: "hawassa@haileresorts.com",
      phone: "+251 46 220 1234",
    },
    {
      slug: "arba-minch",
      branchName: "Arba Minch",
      description: "Luxurious resort overlooking Nechisar National Park",
      heroImage: "/uploads/branches/branch02.jpg",
      directionsUrl: "https://maps.google.com/?q=Haile+Arba+Minch+Resort",
      starRating: 4,
      email: "arbaminch@haileresorts.com",
      phone: "+251 46 881 1234",
    },
    {
      slug: "addis-ababa",
      branchName: "Addis Ababa",
      description: "Premium city hotel in the heart of Addis Ababa",
      heroImage: "/uploads/branches/branch03.jpg",
      directionsUrl: "https://maps.google.com/?q=Haile+Addis+Ababa+Hotel",
      starRating: 5,
      email: "addis@haileresorts.com",
      phone: "+251 11 552 1234",
    },
    {
      slug: "gonder",
      branchName: "Gonder",
      description: "Historic luxury resort near the ancient castles of Gondar",
      heroImage: "/uploads/branches/branch04.jpg",
      directionsUrl: "https://maps.google.com/?q=Haile+Gonder+Resort",
      starRating: 4,
      email: "gonder@haileresorts.com",
      phone: "+251 58 114 1234",
    },
    {
      slug: "shashemene",
      branchName: "Shashemene",
      description: "Boutique lodge offering unique cultural experiences",
      heroImage: "/uploads/branches/branch05.jpg",
      directionsUrl: "https://maps.google.com/?q=Haile+Shashemene+Lodge",
      starRating: 4,
      email: "shashemene@haileresorts.com",
      phone: "+251 33 336 1234",
    },
  ];

  for (const data of branchData) {
    const branch = await prisma.branch.create({
      data: {
        ...data,
        published: true,
      },
    });
    branches.push(branch);
  }

  console.log(`✅ Created ${branches.length} branches`);
  return branches;
}

async function createUsers(branches: any[]) {
  console.log("👥 Creating users...");

  // Create super admin first
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@haileresorts.com",
      role: "SUPER_ADMIN",
    },
  });

  // Create branch users
  for (const branch of branches) {
    await prisma.user.create({
      data: {
        name: `Manager ${branch.branchName}`,
        email: `manager@${branch.slug}.com`,
        role: "MANAGER",
        branchId: branch.id,
      },
    });

    await prisma.user.create({
      data: {
        name: `Staff ${branch.branchName}`,
        email: `staff@${branch.slug}.com`,
        role: "STAFF",
        branchId: branch.id,
      },
    });
  }
}

async function createRoomData(branches: any[]) {
  console.log("🛏️ Creating room types and rooms for each branch...");

  // Find Hawassa branch specifically
  const hawassaBranch = branches.find((b) => b.slug === "hawassa");
  const otherBranches = branches.filter((b) => b.slug !== "hawassa");

  // Store room types by branch slug for frontend reference
  const roomTypesByBranch = {};

  // Create Hawassa first with specific room types (this should get IDs 1 and 2)
  if (hawassaBranch) {
    console.log(`📝 Creating rooms for Hawassa branch first...`);

    // Create Room Types for Hawassa
    const deluxeRoomType = await prisma.roomType.create({
      data: {
        name: "Deluxe King Room",
        description: "Comfortable room with king bed and lake view",
        capacity: 2,
        childrenCapacity: 1,
        basePrice: 180.0,
        amenities: ["WiFi", "Air Conditioning", "Mini Bar", "TV", "Balcony"],
        available: true,
        totalRooms: 2,
        branchId: hawassaBranch.id,
      },
    });

    const suiteRoomType = await prisma.roomType.create({
      data: {
        name: "Lakeside Suite",
        description: "Spacious suite with direct lake access",
        capacity: 4,
        childrenCapacity: 2,
        basePrice: 320.0,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Mini Bar",
          "TV",
          "Private Deck",
        ],
        available: true,
        totalRooms: 2,
        branchId: hawassaBranch.id,
      },
    });

    // Store room type IDs for Hawassa
    roomTypesByBranch["hawassa"] = {
      deluxe: deluxeRoomType.id,
      suite: suiteRoomType.id,
    };

    // Create Actual Rooms for Hawassa
    const hawassaRooms = [
      // Deluxe Rooms
      {
        roomNumber: "HAW101",
        roomTypeId: deluxeRoomType.id,
        branchId: hawassaBranch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      {
        roomNumber: "HAW102",
        roomTypeId: deluxeRoomType.id,
        branchId: hawassaBranch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      // Suite Rooms
      {
        roomNumber: "HAW201",
        roomTypeId: suiteRoomType.id,
        branchId: hawassaBranch.id,
        status: "AVAILABLE",
        floor: "2",
      },
      {
        roomNumber: "HAW202",
        roomTypeId: suiteRoomType.id,
        branchId: hawassaBranch.id,
        status: "AVAILABLE",
        floor: "2",
      },
    ];

    await prisma.room.createMany({
      data: hawassaRooms,
    });

    console.log(`   ✅ Created ${hawassaRooms.length} rooms for Hawassa`);
    console.log(
      `   🔍 Hawassa Room Type IDs: Deluxe=${deluxeRoomType.id}, Suite=${suiteRoomType.id}`
    );
  }

  // Create rooms for other branches
  for (const branch of otherBranches) {
    console.log(`📝 Creating rooms for branch: ${branch.branchName}`);

    // Create Room Types for this branch
    const standardRoomType = await prisma.roomType.create({
      data: {
        name: "Standard Room",
        description: "Comfortable room with all essential amenities",
        capacity: 2,
        childrenCapacity: 1,
        basePrice: 120.0,
        amenities: ["WiFi", "Air Conditioning", "TV", "Ensuite Bathroom"],
        available: true,
        totalRooms: 4,
        branchId: branch.id,
      },
    });

    const deluxeRoomType = await prisma.roomType.create({
      data: {
        name: "Deluxe Room",
        description: "Spacious room with premium amenities and better views",
        capacity: 3,
        childrenCapacity: 2,
        basePrice: 180.0,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Mini Bar",
          "TV",
          "Balcony",
          "Coffee Maker",
        ],
        available: true,
        totalRooms: 3,
        branchId: branch.id,
      },
    });

    const suiteRoomType = await prisma.roomType.create({
      data: {
        name: "Executive Suite",
        description: "Luxurious suite with separate living area",
        capacity: 4,
        childrenCapacity: 2,
        basePrice: 320.0,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Mini Bar",
          "TV",
          "Private Deck",
          "Jacuzzi",
        ],
        available: true,
        totalRooms: 2,
        branchId: branch.id,
      },
    });

    // Store room type IDs for this branch
    roomTypesByBranch[branch.slug] = {
      standard: standardRoomType.id,
      deluxe: deluxeRoomType.id,
      suite: suiteRoomType.id,
    };

    // Create Actual Rooms for this branch
    const roomsData = [
      // Standard Rooms
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}101`,
        roomTypeId: standardRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}102`,
        roomTypeId: standardRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}103`,
        roomTypeId: standardRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}104`,
        roomTypeId: standardRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "1",
      },
      // Deluxe Rooms
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}201`,
        roomTypeId: deluxeRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "2",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}202`,
        roomTypeId: deluxeRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "2",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}203`,
        roomTypeId: deluxeRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "2",
      },
      // Suite Rooms
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}301`,
        roomTypeId: suiteRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "3",
      },
      {
        roomNumber: `${branch.slug.toUpperCase().substring(0, 3)}302`,
        roomTypeId: suiteRoomType.id,
        branchId: branch.id,
        status: "AVAILABLE",
        floor: "3",
      },
    ];

    await prisma.room.createMany({
      data: roomsData,
    });

    console.log(
      `   ✅ Created ${roomsData.length} rooms for ${branch.branchName}`
    );
  }

  return roomTypesByBranch;
}

async function createAttractions(branches: any[]) {
  console.log("🏞️ Creating attractions...");

  const attractionsData = [
    { label: "Lake Hawassa", image: "/uploads/attractions/attraction01.jpg" },
    {
      label: "St Gabriel Church",
      image: "/uploads/attractions/attraction02.jpg",
    },
    {
      label: "Wildlife Sanctuary",
      image: "/uploads/attractions/attraction03.jpg",
    },
    { label: "Nechisar Park", image: "/uploads/attractions/attraction04.jpg" },
    { label: "Lake Chamo", image: "/uploads/attractions/attraction05.jpg" },
    { label: "Forty Springs", image: "/uploads/attractions/attraction06.jpg" },
    {
      label: "National Museum",
      image: "/uploads/attractions/attraction07.jpg",
    },
    { label: "Mount Entoto", image: "/uploads/attractions/attraction08.jpg" },
    { label: "Merkato Market", image: "/uploads/attractions/attraction09.jpg" },
    {
      label: "Royal Enclosure",
      image: "/uploads/attractions/attraction10.jpg",
    },
    {
      label: "Historic Church",
      image: "/uploads/attractions/attraction11.jpg",
    },
    {
      label: "Simien Mountains",
      image: "/uploads/attractions/attraction12.jpg",
    },
    {
      label: "Cultural Center",
      image: "/uploads/attractions/attraction02.jpg",
    },
    {
      label: "Wildlife Reserve",
      image: "/uploads/attractions/attraction01.jpg",
    },
    { label: "Lake Shalla", image: "/uploads/attractions/attraction15.jpg" },
  ];

  let attractionIndex = 0;
  for (const branch of branches) {
    for (let i = 0; i < 3; i++) {
      if (attractionIndex < attractionsData.length) {
        await prisma.attraction.create({
          data: {
            label: attractionsData[attractionIndex].label,
            image: attractionsData[attractionIndex].image,
            branchId: branch.id,
          },
        });
        attractionIndex++;
      }
    }
  }
}

async function createAccommodations(branches: any[]) {
  console.log("🏠 Creating accommodations...");

  const accommodationsData = [
    {
      title: "Luxury Villa",
      description: "Private villa with panoramic views",
      image: "/uploads/accommodations/accommodation01.jpg",
    },
    {
      title: "Family Suite",
      description: "Spacious suite for families",
      image: "/uploads/accommodations/accommodation02.jpg",
    },
    {
      title: "Business Room",
      description: "Room with work desk and facilities",
      image: "/uploads/accommodations/accommodation03.JPG",
    },
    {
      title: "Honeymoon Suite",
      description: "Romantic suite for couples",
      image: "/uploads/accommodations/accommodation04.jpg",
    },
    {
      title: "Accessible Room",
      description: "Room for guests with mobility needs",
      image: "/uploads/accommodations/accommodation05.jpg",
    },
  ];
  for (const branch of branches) {
    for (const accommodation of accommodationsData) {
      await prisma.accommodation.create({
        data: {
          ...accommodation,
          branchId: branch.id,
        },
      });
    }
  }
}

async function createExperiencesWithPackages(branches: any[]) {
  console.log("🎯 Creating experiences with packages...");

  const experiencesData = [
    {
      branchSlug: "hawassa",
      title: "Lake Hawassa Bird Watching",
      description: "Guided bird watching tour around Lake Hawassa",
      highlightImage: "/uploads/experiences/experience1.jpg",
      packages: [
        {
          title: "Morning Bird Watching",
          description: "Early morning tour with expert guide",
          price: 45.0,
          duration: "3 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "hawassa",
      title: "Cultural Village Tour",
      description: "Immerse in local Sidama culture",
      highlightImage: "/uploads/experiences/experience2.jpg",
      packages: [
        {
          title: "Sidama Cultural Experience",
          description: "Traditional coffee ceremony and village life",
          price: 35.0,
          duration: "2 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
    {
      branchSlug: "arba-minch",
      title: "Nechisar National Park Safari",
      description: "Wildlife safari in beautiful national park",
      highlightImage: "/uploads/experiences/experience3.jpg",
      packages: [
        {
          title: "Half Day Safari",
          description: "Morning wildlife viewing",
          price: 75.0,
          duration: "4 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "arba-minch",
      title: "Lake Chamo Boat Trip",
      description: "Boat excursion to see crocodiles",
      highlightImage: "/uploads/experiences/experience4.jpg",
      packages: [
        {
          title: "Crocodile Market Tour",
          description: "See giant crocodiles up close",
          price: 40.0,
          duration: "2 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "arba-minch",
      title: "Hiking to Forty Springs",
      description: "Scenic hike to natural springs",
      highlightImage: "/uploads/experiences/experience5.jpg",
      packages: [
        {
          title: "Guided Hike",
          description: "Moderate hike with beautiful views",
          price: 55.0,
          duration: "5 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "addis-ababa",
      title: "City Heritage Tour",
      description: "Explore rich history of Addis Ababa",
      highlightImage: "/uploads/experiences/experience6.jpg",
      packages: [
        {
          title: "Historical Addis Tour",
          description: "Visit key historical sites",
          price: 60.0,
          duration: "6 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
    {
      branchSlug: "addis-ababa",
      title: "Ethiopian Coffee Experience",
      description: "Traditional coffee ceremony and tasting",
      highlightImage: "/uploads/experiences/experience7.jpg",
      packages: [
        {
          title: "Coffee Ceremony",
          description: "Authentic Ethiopian coffee experience",
          price: 25.0,
          duration: "1.5 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
    {
      branchSlug: "gonder",
      title: "Castles of Gondar Tour",
      description: "Explore ancient royal enclosure",
      highlightImage: "/uploads/experiences/experience8.jpg",
      packages: [
        {
          title: "Royal Enclosure Tour",
          description: "Guided tour of Fasil Ghebbi",
          price: 30.0,
          duration: "3 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
    {
      branchSlug: "gonder",
      title: "Simien Mountains Day Trip",
      description: "Scenic excursion to mountains",
      highlightImage: "/uploads/experiences/experience9.jpg",
      packages: [
        {
          title: "Mountain Viewpoint",
          description: "Day trip with picnic and views",
          price: 90.0,
          duration: "9 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "shashemene",
      title: "Rastafarian Heritage Tour",
      description: "Explore unique Rastafarian culture",
      highlightImage: "/uploads/experiences/experience10.jpg",
      packages: [
        {
          title: "Cultural Center Visit",
          description: "Guided tour of community",
          price: 25.0,
          duration: "2 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
    {
      branchSlug: "shashemene",
      title: "Lake Shalla Bird Watching",
      description: "Bird watching at beautiful lake",
      highlightImage: "/uploads/experiences/experience11.jpg",
      packages: [
        {
          title: "Lake Excursion",
          description: "Bird watching and nature walk",
          price: 40.0,
          duration: "4 hours",
          category: "NATURE" as const,
        },
      ],
    },
    {
      branchSlug: "shashemene",
      title: "Traditional Cooking",
      description: "Learn authentic Ethiopian dishes",
      highlightImage: "/uploads/experiences/experience12.jpg",
      packages: [
        {
          title: "Cooking Class",
          description: "Hands-on culinary experience",
          price: 50.0,
          duration: "3 hours",
          category: "CULTURAL" as const,
        },
      ],
    },
  ];

  for (const branch of branches) {
    const branchExperiences = experiencesData.filter(
      (exp) => exp.branchSlug === branch.slug
    );

    for (const expData of branchExperiences) {
      const experience = await prisma.experience.create({
        data: {
          title: expData.title,
          description: expData.description,
          highlightImage: expData.highlightImage,
          branchId: branch.id,
        },
      });

      for (const pkgData of expData.packages) {
        await prisma.package.create({
          data: {
            title: pkgData.title,
            description: pkgData.description,
            price: pkgData.price,
            duration: pkgData.duration,
            category: pkgData.category,
            available: true,
            branchId: branch.id,
            experienceId: experience.id,
          },
        });
      }
    }
  }
}

async function createBranchDetails(branches: any[]) {
  console.log("📝 Creating branch details...");

  const locationData: { [key: string]: any } = {
    hawassa: { city: "Hawassa", region: "Sidama", country: "Ethiopia" },
    "arba-minch": {
      city: "Arba Minch",
      region: "Southern Nations",
      country: "Ethiopia",
    },
    "addis-ababa": {
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
    },
    gonder: { city: "Gondar", region: "Amhara", country: "Ethiopia" },
    shashemene: { city: "Shashemene", region: "Oromia", country: "Ethiopia" },
  };

  for (const branch of branches) {
    // Create location
    await prisma.location.create({
      data: {
        ...locationData[branch.slug],
        branchId: branch.id,
      },
    });

    // Create SEO data
    await prisma.branchSeo.create({
      data: {
        title: `${branch.branchName} - Haile Hotels & Resorts`,
        description: branch.description,
        keywords: ["hotel", "resort", "Ethiopia", "luxury", "accommodation"],
        branchId: branch.id,
      },
    });

    // Create contact information
    await prisma.contact.create({
      data: {
        phone: branch.phone,
        email: branch.email,
        address: `${locationData[branch.slug].city}, ${locationData[branch.slug].region}, Ethiopia`,
        socials: {
          facebook: `https://facebook.com/haile${branch.slug}`,
          instagram: `https://instagram.com/haile${branch.slug}`,
          twitter: `https://twitter.com/haile${branch.slug}`,
        },
        branchId: branch.id,
      },
    });
  }
}

async function createJobOpenings(branches: any[]) {
  console.log("💼 Creating job openings...");

  const jobOpeningsData = [
    {
      title: "Front Desk Supervisor",
      department: "Reception",
      description: "Manage front desk operations",
      location: "Haile Hawassa Resort",
      type: "Full-time",
      experienceLevel: "Mid",
      salaryRange: "Negotiable",
      deadline: new Date("2025-11-15"),
      responsibilities: ["Oversee operations"],
      requirements: ["2+ years experience"],
      published: true,
      branchSlug: "hawassa",
    },
  ];

  let createdCount = 0;
  let errorCount = 0;

  for (const jobData of jobOpeningsData) {
    try {
      const branch = branches.find((b) => b.slug === jobData.branchSlug);

      if (!branch) {
        console.error(`❌ Branch not found: ${jobData.branchSlug}`);
        errorCount++;
        continue;
      }

      console.log(
        `🔴 Creating job for branch: ${branch.branchName} (ID: ${branch.id})`
      );

      const job = await prisma.jobOpening.create({
        data: {
          title: jobData.title,
          department: jobData.department,
          description: jobData.description,
          location: jobData.location,
          type: jobData.type,
          experienceLevel: jobData.experienceLevel,
          salaryRange: jobData.salaryRange,
          deadline: jobData.deadline,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          published: jobData.published,
          branchId: branch.id,
        },
      });

      console.log(`✅ Created job: ${job.id} - ${job.title}`);
      createdCount++;
    } catch (error) {
      console.error(
        `❌ Failed to create job "${jobData.title}":`,
        error.message
      );
      errorCount++;
    }
  }

  console.log(`📊 Result: ${createdCount} created, ${errorCount} failed`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
