// /app/api/admin/rooms-prices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");

    // Build where clause
    let whereClause: any = {};
    if (branchSlug && branchSlug !== "all") {
      const branch = await prisma.branch.findUnique({
        where: { slug: branchSlug },
      });
      if (branch) {
        whereClause.branchId = branch.id;
      }
    }

    // Get room inventory with status counts
    const roomTypes = await prisma.roomType.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            branchName: true,
            slug: true,
          },
        },
        rooms: {
          include: {
            roomBookings: {
              where: {
                booking: {
                  OR: [{ status: "CONFIRMED" }, { status: "CHECKED_IN" }],
                },
              },
            },
          },
        },
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    const inventory = roomTypes.map((roomType) => {
      const totalRooms = roomType.rooms.length;
      const occupiedRooms = roomType.rooms.filter(
        (room) => room.roomBookings.length > 0
      ).length;
      const availableRooms = totalRooms - occupiedRooms;
      const occupancyRate =
        totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

      return {
        id: roomType.id,
        name: roomType.name,
        basePrice: roomType.basePrice,
        capacity: roomType.capacity,
        branch: roomType.branch,
        inventory: {
          total: totalRooms,
          occupied: occupiedRooms,
          available: availableRooms,
          occupancyRate: Math.round(occupancyRate),
        },
        status: availableRooms > 0 ? "AVAILABLE" : "SOLD_OUT",
      };
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}
