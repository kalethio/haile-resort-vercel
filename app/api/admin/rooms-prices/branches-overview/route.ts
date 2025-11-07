// app/api/admin/inventory/branches-overview/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        roomTypes: {
          include: {
            rooms: true,
            roomFeatures: true,
          },
        },
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
          },
        },
      },
    });

    const branchesWithStats = branches.map((branch) => {
      const roomCount = branch.roomTypes.reduce(
        (sum, roomType) => sum + roomType.rooms.length,
        0
      );
      const occupiedRooms = branch.roomTypes.reduce(
        (sum, roomType) =>
          sum +
          roomType.rooms.filter(
            (room) => room.roomBookings && room.roomBookings.length > 0
          ).length,
        0
      );

      const occupancyRate =
        roomCount > 0 ? Math.round((occupiedRooms / roomCount) * 100) : 0;
      const totalRevenue = branch.bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      );

      return {
        id: branch.id,
        slug: branch.slug,
        branchName: branch.branchName,
        description: branch.description,
        roomCount,
        occupancyRate,
        totalRevenue,
      };
    });

    return NextResponse.json(branchesWithStats);
  } catch (error) {
    console.error("Branches overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches overview" },
      { status: 500 }
    );
  }
}
