import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = parseInt(searchParams.get("guests") || "2");

    // Validate required parameters
    if (!branchSlug || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required parameters: branch, checkIn, checkOut" },
        { status: 400 }
      );
    }

    // Convert dates to DateTime
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find the branch
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      include: {
        roomTypes: {
          include: {
            rooms: {
              include: {
                roomBookings: {
                  where: {
                    booking: {
                      status: {
                        in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
                      },
                      OR: [
                        {
                          checkIn: { lt: checkOutDate },
                          checkOut: { gt: checkInDate },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Calculate available rooms for each room type
    const availableRoomTypes = branch.roomTypes
      .filter((roomType) => roomType.available && roomType.capacity >= guests)
      .map((roomType) => {
        const totalRooms = roomType.rooms.length;
        const bookedRooms = roomType.rooms.filter(
          (room) => room.roomBookings.length > 0
        ).length;
        const availableRooms = totalRooms - bookedRooms;

        return {
          id: roomType.id,
          name: roomType.name,
          description: roomType.description,
          capacity: roomType.capacity,
          basePrice: roomType.basePrice,
          amenities: roomType.amenities || [],
          images: [], // You can add image logic later
          available: availableRooms > 0,
          availableRooms,
          totalRooms,
        };
      })
      .filter((roomType) => roomType.available);

    return NextResponse.json({
      roomTypes: availableRoomTypes,
      summary: {
        checkIn,
        checkOut,
        guests,
        totalAvailable: availableRoomTypes.length,
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
