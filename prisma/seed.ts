// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  try {
    // 1. Create SUPER_ADMIN Role & Permissions FIRST
    console.log("👑 Creating SUPER_ADMIN role...");
    await createSuperAdminRole();

    // 2. Create Branches seed
    console.log("🏨 Creating branches...");
    const branches = await createBranches();

    // 3. Create SUPER_ADMIN User (only one user)
    console.log("👥 Creating SUPER_ADMIN user...");
    await createSuperAdminUser();

    // 4. Create Room Data
    console.log("🛏️ Creating rooms...");
    await createRoomData(branches);

    // 5. Create Experiences & Packages
    console.log("🎯 Creating experiences...");
    await createExperiencesWithPackages(branches);

    // 6. Create Job Openings
    console.log("💼 Creating jobs...");
    await createJobOpenings(branches);

    // 7. Create Other Data
    console.log("🏞️ Creating attractions...");
    await createAttractions(branches);

    console.log("🏠 Creating accommodations...");
    await createAccommodations(branches);

    console.log("📝 Creating branch details...");
    await createBranchDetails(branches);

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// ============================
// SUPER_ADMIN FUNCTIONS
// ============================
async function createSuperAdminRole() {
  // Clear existing roles and permissions
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  // Create only SUPER_ADMIN role
  const superAdminRole = await prisma.role.create({
    data: {
      name: "SUPER_ADMIN",
      description: "Full system access - cannot be deleted",
      isSystem: true,
    },
  });

  // Use the OLD permission keys that sidebar expects
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

  // Create 'view' permissions for each module (sidebar checks for .view/.read)
  for (const moduleName of permissionModules) {
    await prisma.permission.create({
      data: {
        module: moduleName,
        action: "view",
        roleId: superAdminRole.id,
      },
    });
  }

  console.log(
    `✅ Created SUPER_ADMIN role with ${permissionModules.length} module permissions`
  );
  return superAdminRole;
}

async function createSuperAdminUser() {
  const email = "superadmin@haileresorts.com";

  // Check if SUPER_ADMIN user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log("✅ SUPER_ADMIN user already exists");
    return;
  }

  // Create only one SUPER_ADMIN user (system-wide)
  await prisma.user.create({
    data: {
      name: "Super Administrator",
      email,
      password: "$2b$10$HASHED_admin123", // Replace later with bcrypt hash if dynamic
      roleId: (await prisma.role.findFirst({ where: { name: "SUPER_ADMIN" } }))!
        .id,
      status: "ACTIVE",
    },
  });

  console.log("✅ Created SUPER_ADMIN user: superadmin@haileresorts.com");
}
// YOUR EXISTING FUNCTIONS - KEEP THEM EXACTLY AS THEY WERE
async function createBranches() {
  console.log("🏨 Creating branches...");

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
          category: "NATURE",
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
          category: "CULTURAL",
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
          category: "NATURE",
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
          category: "NATURE",
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
          category: "NATURE",
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
          category: "CULTURAL",
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
          category: "CULTURAL",
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
          category: "CULTURAL",
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
          category: "NATURE",
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
          category: "CULTURAL",
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
          category: "NATURE",
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
          category: "CULTURAL",
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
      console.error(`❌ Failed to create job "${jobData.title}":`, error);
      errorCount++;
    }
  }

  console.log(`📊 Result: ${createdCount} created, ${errorCount} failed`);
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
    await prisma.location.create({
      data: {
        ...locationData[branch.slug],
        branchId: branch.id,
      },
    });

    await prisma.branchSeo.create({
      data: {
        title: `${branch.branchName} - Haile Hotels & Resorts`,
        description: branch.description,
        keywords: ["hotel", "resort", "Ethiopia", "luxury", "accommodation"],
        branchId: branch.id,
      },
    });

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

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
