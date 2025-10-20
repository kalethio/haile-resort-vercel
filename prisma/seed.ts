// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.branch.deleteMany();

  // Create Hawassa Branch
  const hawassaBranch = await prisma.branch.create({
    data: {
      slug: "hawassa",
      branchName: "Haile Hawassa Resort",
      description: "Beautiful lakeside resort on the shores of Lake Hawassa",
      heroImage: "/images/branchesPictures/branchHero1.jpg",
      starRating: 4,
      published: true,
      email: "hawassa@haileresorts.com",
      phone: "+251 46 220 1234",
      location: {
        create: {
          city: "Hawassa",
          region: "Sidama",
          country: "Ethiopia",
        },
      },
    },
  });

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
      amenities: ["WiFi", "Air Conditioning", "Mini Bar", "TV", "Private Deck"],
      available: true,
      totalRooms: 2,
      branchId: hawassaBranch.id,
    },
  });

  // Create Actual Rooms
  await prisma.room.createMany({
    data: [
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
    ],
  });

  console.log("✅ Seed completed! Created:");
  console.log("   - Hawassa branch with 2 room types and 4 rooms");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
