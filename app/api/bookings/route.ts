// /app/api/bookings/route.ts - NO TAX VERSION
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
      totalAmount,
      baseAmount,
      nights,
    } = body;

    // ✅ Validate required fields
    if (
      !branchSlug ||
      !roomTypeId ||
      !checkIn ||
      !checkOut ||
      !adults ||
      !guestName ||
      !guestEmail ||
      totalAmount === undefined || // ✅ Allows 0
      totalAmount === null ||
      baseAmount === undefined || // ✅ Allows 0
      baseAmount === null ||
      nights === undefined || // ✅ Allows 0
      nights === null
    ) {
      console.log("❌ Missing fields:", {
        branchSlug,
        roomTypeId,
        checkIn,
        checkOut,
        adults,
        guestName,
        guestEmail,
        totalAmount,
        baseAmount,
        nights,
      });
      return NextResponse.json(
        { error: "Missing required fields including pricing data" },
        { status: 400 }
      );
    }

    // ✅ Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const localCheckIn = new Date(checkIn);
    localCheckIn.setHours(0, 0, 0, 0);

    if (localCheckIn < today) {
      return NextResponse.json(
        { error: "Check-in date must be today or in the future" },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in" },
        { status: 400 }
      );
    }

    // 1️⃣ Check branch existence
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json(
        { error: `Branch not found: ${branchSlug}` },
        { status: 404 }
      );
    }

    // 2️⃣ Check room type availability
    const roomType = await prisma.roomType.findFirst({
      where: {
        id: parseInt(roomTypeId),
        branchId: branch.id,
        available: true,
      },
    });

    if (!roomType) {
      return NextResponse.json(
        {
          error: `Room type ${roomTypeId} not available in ${branch.branchName}`,
        },
        { status: 400 }
      );
    }

    // ✅ Validate guest capacity
    if (adults > roomType.capacity) {
      return NextResponse.json(
        {
          error: `Room capacity exceeded. Maximum ${roomType.capacity} guests allowed.`,
        },
        { status: 400 }
      );
    }

    // 3️⃣ Check available rooms
    let availableRoom = await prisma.room.findFirst({
      where: {
        roomTypeId: parseInt(roomTypeId),
        branchId: branch.id,
        status: "AVAILABLE",
      },
    });

    if (!availableRoom) {
      console.log(
        "⚠️ No available rooms — creating test room for development..."
      );
      availableRoom = await prisma.room.create({
        data: {
          roomNumber: `TEST-${Date.now()}`,
          roomTypeId: parseInt(roomTypeId),
          branchId: branch.id,
          status: "AVAILABLE",
        },
      });
    }

    // 👤 Create or find guest
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

    // 🏨 Create booking - NO TAX FIELDS
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
        totalAmount, // Your provided total
        baseAmount: 0, // ← ADD THIS (required by Prisma)
        taxAmount: 0, // ← ADD THIS (required by Prisma)
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
