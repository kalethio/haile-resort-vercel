// app/api/admin/inventory/branch-reports/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { slug } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get("startDate") || new Date());
    const endDate = new Date(searchParams.get("endDate") || new Date());

    const branch = await prisma.branch.findUnique({
      where: { slug },
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

    // --- Calculate room type stats ---
    const roomTypesWithStats = await Promise.all(
      branch.roomTypes.map(async (roomType) => {
        // ✅ FIX: Use roomType.totalRooms instead of counting rooms
        const totalRooms = roomType.totalRooms;

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
          roomCount: totalRooms, // ✅ Now reflects edited values
          totalRooms: totalRooms, // ✅ Add totalRooms for frontend
          basePrice: roomType.basePrice,
          features: roomType.roomFeatures?.map((f) => f.name) || [],
          amenities: (roomType as any).amenities || [],
          occupancyRate,
          revenue,
          availableRooms,
        };
      })
    );

    // --- Aggregate metrics ---
    const totalRooms = roomTypesWithStats.reduce(
      (sum, rt) => sum + rt.totalRooms,
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
