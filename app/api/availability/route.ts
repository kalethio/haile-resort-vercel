import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = parseInt(searchParams.get("guests") || "2");

    if (!branchSlug || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // For now, return mock data to test
    const mockRoomTypes = [
      {
        id: 1,
        name: "Deluxe King Room",
        description: "Spacious room with king-sized bed and modern amenities",
        capacity: 2,
        basePrice: 199,
        amenities: ["WiFi", "Air Conditioning", "TV", "Mini Bar"],
        images: [],
        available: true,
      },
      {
        id: 2,
        name: "Executive Suite",
        description: "Luxurious suite with separate living area",
        capacity: 4,
        basePrice: 299,
        amenities: [
          "WiFi",
          "Air Conditioning",
          "2 TVs",
          "Mini Bar",
          "Work Desk",
        ],
        images: [],
        available: true,
      },
    ];

    return NextResponse.json({
      roomTypes: mockRoomTypes,
      summary: {
        checkIn,
        checkOut,
        guests,
        totalAvailable: mockRoomTypes.length,
        branchName: "Hawassa Resort",
      },
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
