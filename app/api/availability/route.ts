// /app/api/availability/route.ts - FIXED VERSION WITH IMAGES
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = parseInt(searchParams.get("adults") || "2");
    const children = parseInt(searchParams.get("children") || "0");

    if (!branchSlug || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get branch with room types INCLUDING IMAGES
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      include: {
        roomTypes: {
          where: { available: true },
          include: {
            roomTypeMedia: {
              include: {
                media: true,
              },
              orderBy: {
                order: "asc",
              },
            },
            rooms: {
              include: {
                roomBookings: {
                  include: { booking: true },
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

    // Calculate available rooms with proper image handling
    const availableRoomTypes = branch.roomTypes.map((roomType) => {
      const totalRooms = roomType.rooms.length;

      // Count unavailable rooms due to booking conflicts
      const unavailableRooms = roomType.rooms.filter((room) => {
        return room.roomBookings.some((roomBooking) => {
          const booking = roomBooking.booking;

          if (
            booking.status === "CANCELLED" ||
            booking.status === "CHECKED_OUT"
          ) {
            return false;
          }

          const existingCheckIn = new Date(booking.checkIn);
          const existingCheckOut = new Date(booking.checkOut);

          const hasOverlap =
            checkInDate < existingCheckOut && checkOutDate > existingCheckIn;

          return hasOverlap;
        });
      }).length;

      const availableRooms = totalRooms - unavailableRooms;

      // Capacity check - adults only (children can share)
      const canAccommodateAdults = roomType.capacity >= adults;
      const available = availableRooms > 0 && canAccommodateAdults;

      // ✅ PROPER IMAGE HANDLING - extract URLs from roomTypeMedia relation
      const imageUrls =
        roomType.roomTypeMedia?.map((rtm) => rtm.media.url) || [];

      return {
        id: roomType.id,
        name: roomType.name,
        description: roomType.description,
        capacity: roomType.capacity,
        basePrice: roomType.basePrice,
        amenities: roomType.amenities || [],
        images: imageUrls, // ✅ NOW HAS ACTUAL IMAGES FROM DATABASE
        available: available,
        availableRoomsCount: availableRooms,
        totalRooms: totalRooms,
        unavailableRooms: unavailableRooms,
        canAccommodateAdults: canAccommodateAdults,
      };
    });

    // Filter available rooms
    const filteredRoomTypes = availableRoomTypes.filter(
      (roomType) => roomType.available && roomType.canAccommodateAdults
    );

    console.log("🔍 AVAILABILITY WITH IMAGES DEBUG:", {
      branch: branch.branchName,
      dates: `${checkIn} to ${checkOut}`,
      adults,
      children,
      roomTypes: availableRoomTypes.map((rt) => ({
        name: rt.name,
        capacity: rt.capacity,
        availableRooms: rt.availableRoomsCount,
        imagesCount: rt.images.length, // ✅ Now shows actual image count
        available: rt.available,
      })),
    });

    return NextResponse.json({
      roomTypes: filteredRoomTypes,
      summary: {
        checkIn,
        checkOut,
        adults,
        children,
        totalAvailable: filteredRoomTypes.length,
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
