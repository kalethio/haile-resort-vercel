// app/api/admin/inventory/branch-reports/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps // ← Add type
) {
  const { slug } = await params; // ← AWAIT params

  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get("startDate") || new Date());
    const endDate = new Date(searchParams.get("endDate") || new Date());

    const branch = await prisma.branch.findUnique({
      where: { slug: slug }, // ← Use awaited slug
      include: {
        roomTypes: {
          include: {
            rooms: {
              include: {
                roomBookings: {
                  include: { booking: true },
                },
              },
            },
            roomFeatures: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Calculate room type reports
    const roomTypesWithStats = await Promise.all(
      branch.roomTypes.map(async (roomType) => {
        const totalRooms = roomType.rooms.length;

        // Calculate occupied rooms for the date range
        const occupiedRooms = roomType.rooms.filter((room) =>
          room.roomBookings.some((rb) => {
            const booking = rb.booking;
            const bookingStart = new Date(booking.checkIn);
            const bookingEnd = new Date(booking.checkOut);
            return bookingStart <= endDate && bookingEnd >= startDate;
          })
        ).length;

        const availableRooms = totalRooms - occupiedRooms;
        const occupancyRate =
          totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        // Calculate revenue for the date range
        const revenue = roomType.rooms.reduce(
          (sum, room) =>
            sum +
            room.roomBookings.reduce((bookingSum, rb) => {
              const booking = rb.booking;
              const bookingStart = new Date(booking.checkIn);
              const bookingEnd = new Date(booking.checkOut);

              if (bookingStart <= endDate && bookingEnd >= startDate) {
                return bookingSum + rb.pricePerNight * rb.totalNights;
              }
              return bookingSum;
            }, 0),
          0
        );

        return {
          id: roomType.id,
          name: roomType.name,
          roomCount: totalRooms,
          basePrice: roomType.basePrice,
          features: roomType.roomFeatures.map((f) => f.name),
          occupancyRate,
          revenue,
          availableRooms,
        };
      })
    );

    // Calculate overall metrics
    const totalRooms = roomTypesWithStats.reduce(
      (sum, rt) => sum + rt.roomCount,
      0
    );
    const availableRooms = roomTypesWithStats.reduce(
      (sum, rt) => sum + rt.availableRooms,
      0
    );
    const totalRevenue = roomTypesWithStats.reduce(
      (sum, rt) => sum + rt.revenue,
      0
    );
    const avgOccupancy = Math.round(
      roomTypesWithStats.reduce((sum, rt) => sum + rt.occupancyRate, 0) /
        roomTypesWithStats.length
    );
    const avgDailyRate =
      totalRevenue > 0 ? Math.round(totalRevenue / totalRooms) : 0;
    const revPAR = totalRevenue > 0 ? Math.round(totalRevenue / totalRooms) : 0;

    return NextResponse.json({
      roomTypes: roomTypesWithStats,
      metrics: {
        totalRooms,
        availableRooms,
        avgOccupancy,
        totalRevenue,
        avgDailyRate,
        revPAR,
      },
    });
  } catch (error) {
    console.error("Branch report error:", error);
    return NextResponse.json(
      { error: "Failed to generate branch report" },
      { status: 500 }
    );
  }
}
