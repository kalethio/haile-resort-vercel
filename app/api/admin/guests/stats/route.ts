// app/api/admin/guests/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalGuests, vipGuests, arrivingToday, departingToday, inHouse] =
      await Promise.all([
        prisma.guest.count(),
        prisma.guest.count({ where: { guestType: "VIP" } }),
        prisma.booking.count({
          where: {
            checkIn: { gte: today, lt: tomorrow },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        }),
        prisma.booking.count({
          where: {
            checkOut: { gte: today, lt: tomorrow },
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
        }),
        prisma.booking.count({
          where: { status: "CHECKED_IN" },
        }),
      ]);

    return NextResponse.json({
      total: totalGuests,
      vipCount: vipGuests,
      arrivingToday,
      departingToday,
      inHouse,
    });
  } catch (error) {
    console.error("Guest stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest statistics" },
      { status: 500 }
    );
  }
}
