import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔍 DEBUG - Raw request body:", body);

    const {
      branchSlug,
      roomTypeId,
      checkIn,
      checkOut,
      adults,
      children = 0,
      infants = 0,
      guestName,
      guestEmail,
      guestPhone,
      guestCountry = "",
      specialRequests = "",
    } = body;

    // Validate required fields
    if (
      !branchSlug ||
      !roomTypeId ||
      !checkIn ||
      !checkOut ||
      !adults ||
      !guestName ||
      !guestEmail
    ) {
      console.log("❌ Missing fields:", {
        branchSlug,
        roomTypeId,
        checkIn,
        checkOut,
        adults,
        guestName,
        guestEmail,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Check if branch exists
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    console.log("🔍 Branch lookup:", { branchSlug, branchFound: !!branch });

    if (!branch) {
      return NextResponse.json(
        { error: `Branch not found: ${branchSlug}` },
        { status: 404 }
      );
    }

    // 2. Check if room type exists
    const roomType = await prisma.roomType.findFirst({
      where: {
        id: parseInt(roomTypeId),
        branchId: branch.id,
        available: true,
      },
    });

    console.log("🔍 RoomType lookup:", {
      roomTypeId,
      roomTypeFound: !!roomType,
    });

    if (!roomType) {
      return NextResponse.json(
        {
          error: `Room type ${roomTypeId} not available in ${branch.branchName}`,
        },
        { status: 400 }
      );
    }

    // 3. Check available rooms count
    const availableRoomsCount = await prisma.room.count({
      where: {
        roomTypeId: parseInt(roomTypeId),
        branchId: branch.id,
        status: "AVAILABLE",
      },
    });

    console.log("🔍 Available rooms:", availableRoomsCount);

    // For testing, create a mock booking if no rooms exist
    if (availableRoomsCount === 0) {
      console.log("⚠️ No rooms available, creating test room...");

      // Create a test room for development
      const testRoom = await prisma.room.create({
        data: {
          roomNumber: `TEST-${Date.now()}`,
          roomTypeId: parseInt(roomTypeId),
          branchId: branch.id,
          status: "AVAILABLE",
        },
      });

      console.log("✅ Created test room:", testRoom.id);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Calculate pricing
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const baseAmount = roomType.basePrice * nights;
    const taxAmount = baseAmount * 0.1;
    const totalAmount = baseAmount + taxAmount;

    // Create or find guest
    let guest = await prisma.guest.findUnique({
      where: { email: guestEmail },
    });

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          email: guestEmail,
          firstName: guestName.split(" ")[0],
          lastName: guestName.split(" ").slice(1).join(" ") || "",
          phone: guestPhone,
          branchId: branch.id,
        },
      });
    }

    // Find available room
    const availableRoom = await prisma.room.findFirst({
      where: {
        roomTypeId: parseInt(roomTypeId),
        branchId: branch.id,
        status: "AVAILABLE",
      },
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        type: "ROOM",
        status: "PENDING",
        guestName,
        guestEmail,
        guestPhone,
        guestCountry,
        specialRequests,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults,
        children,
        infants,
        baseAmount,
        taxAmount,
        totalAmount,
        currency: "USD",
        branchId: branch.id,
        guestId: guest.id,
        roomBookings: {
          create: {
            roomId: availableRoom.id,
            pricePerNight: roomType.basePrice,
            totalNights: nights,
          },
        },
      },
      include: {
        branch: {
          select: { branchName: true, slug: true },
        },
      },
    });

    const confirmationUrl = `${request.nextUrl.origin}/booking/confirmation?bookingId=${booking.id}&guestName=${encodeURIComponent(guestName)}`;

    console.log("✅ Booking created successfully:", booking.id);

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      confirmationUrl,
      message: "Booking created successfully",
      debug: {
        branch: branch.branchName,
        roomType: roomType.name,
        nights,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("❌ Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
