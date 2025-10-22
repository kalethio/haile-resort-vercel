// /app/api/availability/route.ts - FIXED VERSION
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

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 1. Get branch and room types
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      include: {
        roomTypes: {
          where: { available: true },
          include: {
            rooms: {
              include: {
                roomBookings: {
                  where: {
                    booking: {
                      OR: [
                        { status: "CONFIRMED" },
                        { status: "CHECKED_IN" },
                        { status: "PENDING" },
                      ],
                      AND: [
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

    // 2. Calculate available rooms for each room type
    const availableRoomTypes = branch.roomTypes
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
          images: [], // You can add media queries here
          available: availableRooms > 0,
          availableRoomsCount: availableRooms,
          totalRooms: totalRooms,
        };
      })
      .filter((roomType) => roomType.available && roomType.capacity >= guests);

    return NextResponse.json({
      roomTypes: availableRoomTypes,
      summary: {
        checkIn,
        checkOut,
        guests,
        totalAvailable: availableRoomTypes.length,
        branchName: branch.branchName,
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
