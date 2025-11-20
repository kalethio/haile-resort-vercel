// /app/api/admin/booking/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Add Promise
) {
  try {
    // ✅ AWAIT the params
    const { id } = await params;
    const { status } = await request.json();

    // ✅ Validate input
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "CANCELLED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status" },
        { status: 400 }
      );
    }

    // ✅ Fetch booking and related room data
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { roomBookings: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // ✅ Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === "CHECKED_IN" && { confirmedAt: new Date() }),
      },
      include: { roomBookings: true },
    });

    // ✅ Update room statuses based on booking status
    if (status === "CHECKED_IN") {
      await prisma.room.updateMany({
        where: {
          id: { in: updatedBooking.roomBookings.map((rb) => rb.roomId) },
        },
        data: { status: "OCCUPIED" },
      });
    } else if (status === "CHECKED_OUT" || status === "CANCELLED") {
      await prisma.room.updateMany({
        where: {
          id: { in: updatedBooking.roomBookings.map((rb) => rb.roomId) },
        },
        data: { status: "AVAILABLE" },
      });
    }

    console.log(`✅ Booking ${id} updated to ${status}`);

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
      },
    });
  } catch (error) {
    console.error("❌ Booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
