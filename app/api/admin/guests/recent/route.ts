// app/api/admin/guests/recent/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const recentGuests = await prisma.guest.findMany({
      take: limit,
      orderBy: { lastStayAt: "desc" },
      include: {
        bookings: {
          take: 1,
          orderBy: { checkIn: "desc" },
          select: {
            checkIn: true,
            checkOut: true,
            totalAmount: true,
            status: true,
          },
        },
      },
    });

    const formattedGuests = recentGuests.map((guest) => ({
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      guestType: guest.guestType,
      totalStays: guest.totalStays,
      lifetimeValue: guest.lifetimeValue,
      lastStayAt: guest.lastStayAt,
      lastBooking: guest.bookings[0] || null,
    }));

    return NextResponse.json(formattedGuests);
  } catch (error) {
    console.error("Recent guests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent guests" },
      { status: 500 }
    );
  }
}
