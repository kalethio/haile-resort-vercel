// /app/api/admin/send-transactional/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, emailType } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 }
      );
    }

    // Get booking with all related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        branch: true,
        guest: true,
        roomBookings: {
          include: {
            room: {
              include: {
                roomType: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.guest) {
      return NextResponse.json(
        { error: "Guest not found for booking" },
        { status: 404 }
      );
    }

    let emailSent = false;

    switch (emailType) {
      case "confirmation":
        emailSent = await sendBookingConfirmation({
          booking: {
            ...booking,
            branch: booking.branch,
            roomBookings: booking.roomBookings,
          },
          guest: booking.guest,
        });
        break;

      case "reminder":
        // Add reminder email logic later
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: emailSent,
      message: emailSent ? "Email sent successfully" : "Failed to send email",
    });
  } catch (error) {
    console.error("Transactional email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
