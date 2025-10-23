// /app/api/admin/booking/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const status = searchParams.get("status");

    // Build where clause based on filters
    let whereClause: any = {};

    // Branch filtering
    if (branchSlug && branchSlug !== "all") {
      const branch = await prisma.branch.findUnique({
        where: { slug: branchSlug },
      });
      if (branch) {
        whereClause.branchId = branch.id;
      }
    }

    // Status filtering
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // Fetch bookings with related data
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            branchName: true,
            slug: true,
          },
        },
        roomBookings: {
          include: {
            room: {
              include: {
                roomType: {
                  select: {
                    name: true,
                    capacity: true,
                  },
                },
              },
            },
          },
        },
        guest: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats
    const stats = {
      total: await prisma.booking.count({ where: whereClause }),
      confirmed: await prisma.booking.count({
        where: { ...whereClause, status: "CONFIRMED" },
      }),
      pending: await prisma.booking.count({
        where: { ...whereClause, status: "PENDING" },
      }),
      checkedIn: await prisma.booking.count({
        where: { ...whereClause, status: "CHECKED_IN" },
      }),
      checkedOut: await prisma.booking.count({
        where: { ...whereClause, status: "CHECKED_OUT" },
      }),
      cancelled: await prisma.booking.count({
        where: { ...whereClause, status: "CANCELLED" },
      }),
    };

    // Transform bookings for response
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      type: booking.type,
      status: booking.status,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkIn: booking.checkIn.toISOString().split("T")[0],
      checkOut: booking.checkOut.toISOString().split("T")[0],
      adults: booking.adults,
      children: booking.children,
      infants: booking.infants,
      totalAmount: booking.totalAmount,
      branch: booking.branch,
      roomBookings: booking.roomBookings.map((rb) => ({
        id: rb.id,
        room: {
          roomNumber: rb.room.roomNumber,
          roomType: {
            name: rb.room.roomType.name,
            capacity: rb.room.roomType.capacity,
          },
        },
        pricePerNight: rb.pricePerNight,
        totalNights: rb.totalNights,
        totalPrice: rb.totalPrice,
      })),
      guest: booking.guest,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt.toISOString(),
      confirmedAt: booking.confirmedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
      stats,
    });
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status, action } = body;

    if (!bookingId || (!status && !action)) {
      return NextResponse.json(
        { error: "Booking ID and status/action required" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        guest: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (status) {
      updateData.status = status;

      // Set confirmedAt when status changes to CONFIRMED
      if (status === "CONFIRMED" && existingBooking.status !== "CONFIRMED") {
        updateData.confirmedAt = new Date();
      }
    }

    // Handle specific actions
    if (action === "checkin" && existingBooking.status !== "CHECKED_IN") {
      updateData.status = "CHECKED_IN";
      updateData.confirmedAt = new Date();
    } else if (
      action === "checkout" &&
      existingBooking.status !== "CHECKED_OUT"
    ) {
      updateData.status = "CHECKED_OUT";
    } else if (action === "cancel" && existingBooking.status !== "CANCELLED") {
      updateData.status = "CANCELLED";
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        branch: {
          select: {
            branchName: true,
            slug: true,
          },
        },
        roomBookings: {
          include: {
            room: {
              include: {
                roomType: {
                  select: {
                    name: true,
                    capacity: true,
                  },
                },
              },
            },
          },
        },
        guest: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send confirmation email when booking is confirmed
    if (status === "CONFIRMED" && updatedBooking.guest) {
      try {
        await sendBookingConfirmation({
          booking: updatedBooking,
          guest: updatedBooking.guest,
        });
        console.log(
          `📧 Confirmation email sent to ${updatedBooking.guest.email}`
        );
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the booking update if email fails
      }
    }

    // Transform response
    const responseBooking = {
      id: updatedBooking.id,
      type: updatedBooking.type,
      status: updatedBooking.status,
      guestName: updatedBooking.guestName,
      guestEmail: updatedBooking.guestEmail,
      guestPhone: updatedBooking.guestPhone,
      checkIn: updatedBooking.checkIn.toISOString().split("T")[0],
      checkOut: updatedBooking.checkOut.toISOString().split("T")[0],
      adults: updatedBooking.adults,
      children: updatedBooking.children,
      infants: updatedBooking.infants,
      totalAmount: updatedBooking.totalAmount,
      branch: updatedBooking.branch,
      roomBookings: updatedBooking.roomBookings.map((rb) => ({
        id: rb.id,
        room: {
          roomNumber: rb.room.roomNumber,
          roomType: {
            name: rb.room.roomType.name,
            capacity: rb.room.roomType.capacity,
          },
        },
        pricePerNight: rb.pricePerNight,
        totalNights: rb.totalNights,
        totalPrice: rb.totalPrice,
      })),
      guest: updatedBooking.guest,
      specialRequests: updatedBooking.specialRequests,
      createdAt: updatedBooking.createdAt.toISOString(),
      confirmedAt: updatedBooking.confirmedAt?.toISOString() || null,
    };

    return NextResponse.json({
      success: true,
      message: `Booking ${updatedBooking.status.toLowerCase()} successfully`,
      booking: responseBooking,
    });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
