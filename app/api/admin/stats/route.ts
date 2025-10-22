import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get total bookings count
    const totalBookings = await prisma.booking.count();

    // Get pending bookings count
    const pendingBookings = await prisma.booking.count({
      where: { status: "PENDING" },
    });

    // Get total revenue from confirmed bookings
    const revenueResult = await prisma.booking.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { totalAmount: true },
    });

    // Calculate occupancy rate (mock for now - enhance with real room data)
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({
      where: {
        roomBookings: {
          some: {
            booking: {
              status: { in: ["CONFIRMED", "CHECKED_IN"] },
            },
          },
        },
      },
    });

    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Today's check-ins/check-outs
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const todayCheckIns = await prisma.booking.count({
      where: {
        checkIn: {
          gte: new Date(todayString),
          lt: new Date(new Date(todayString).setDate(today.getDate() + 1)),
        },
      },
    });

    const todayCheckOuts = await prisma.booking.count({
      where: {
        checkOut: {
          gte: new Date(todayString),
          lt: new Date(new Date(todayString).setDate(today.getDate() + 1)),
        },
      },
    });

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      revenue: revenueResult._sum.totalAmount || 0,
      occupancyRate,
      todayCheckIns,
      todayCheckOuts,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
