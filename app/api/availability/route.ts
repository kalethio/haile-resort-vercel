// /app/api/availability/route.ts - FIXED WITH GUEST COUNT
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

    // Get branch with room types
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
      include: {
        roomTypes: {
          where: { available: true },
          include: {
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

    // Calculate ACTUAL available rooms with guest capacity validation
    const availableRoomTypes = branch.roomTypes.map((roomType) => {
      const totalRooms = roomType.rooms.length;

      // Count rooms that are UNAVAILABLE due to booking conflicts
      const unavailableRooms = roomType.rooms.filter((room) => {
        return room.roomBookings.some((roomBooking) => {
          const booking = roomBooking.booking;

          // Skip if booking is cancelled or checked out
          if (
            booking.status === "CANCELLED" ||
            booking.status === "CHECKED_OUT"
          ) {
            return false;
          }

          const existingCheckIn = new Date(booking.checkIn);
          const existingCheckOut = new Date(booking.checkOut);

          // PROPER DATE OVERLAP DETECTION
          const hasOverlap =
            checkInDate < existingCheckOut && checkOutDate > existingCheckIn;

          return hasOverlap;
        });
      }).length;

      const availableRooms = totalRooms - unavailableRooms;

      // ✅ CRITICAL FIX: Check if room can accommodate guest count
      const canAccommodateGuests = roomType.capacity >= guests;

      // Room is available ONLY if:
      // 1. Has available rooms AND
      // 2. Can accommodate the requested number of guests
      const available = availableRooms > 0 && canAccommodateGuests;

      return {
        id: roomType.id,
        name: roomType.name,
        description: roomType.description,
        capacity: roomType.capacity,
        basePrice: roomType.basePrice,
        amenities: roomType.amenities || [],
        images: [],
        available: available,
        availableRoomsCount: availableRooms,
        totalRooms: totalRooms,
        unavailableRooms: unavailableRooms,
        canAccommodateGuests: canAccommodateGuests, // For debugging
      };
    });

    // Only return rooms that are actually available AND can accommodate guests
    const filteredRoomTypes = availableRoomTypes.filter(
      (roomType) => roomType.available && roomType.canAccommodateGuests
    );

    console.log("🔍 AVAILABILITY DEBUG WITH GUEST COUNT:", {
      branch: branch.branchName,
      dates: `${checkIn} to ${checkOut}`,
      requestedGuests: guests,
      roomTypes: availableRoomTypes.map((rt) => ({
        name: rt.name,
        capacity: rt.capacity,
        totalRooms: rt.totalRooms,
        availableRooms: rt.availableRoomsCount,
        unavailableRooms: rt.unavailableRooms,
        canAccommodateGuests: rt.canAccommodateGuests,
        available: rt.available,
      })),
    });

    return NextResponse.json({
      roomTypes: filteredRoomTypes,
      summary: {
        checkIn,
        checkOut,
        guests,
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
