// app/api/admin/inventory/rooms/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID required" },
        { status: 400 }
      );
    }

    const roomTypes = await prisma.roomType.findMany({
      where: { branchId: parseInt(branchId) },
      include: {
        rooms: true,
        roomFeatures: true,
      },
    });

    // Calculate available rooms
    const roomTypesWithAvailability = await Promise.all(
      roomTypes.map(async (roomType) => {
        const availableRooms = await prisma.room.count({
          where: {
            roomTypeId: roomType.id,
            status: "AVAILABLE",
          },
        });

        return {
          ...roomType,
          availableRooms,
          amenities: roomType.amenities || [],
        };
      })
    );

    return NextResponse.json(roomTypesWithAvailability);
  } catch (error) {
    console.error("Rooms fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      capacity,
      basePrice,
      totalRooms,
      branchId,
      featureIds,
    } = body;

    // Create room type
    const roomType = await prisma.roomType.create({
      data: {
        name,
        description,
        capacity,
        basePrice,
        totalRooms,
        branchId,
        amenities: [],
      },
    });

    // Create rooms
    const rooms = Array.from({ length: totalRooms }, (_, i) => ({
      roomNumber: `${name.substring(0, 3).toUpperCase()}${(i + 1).toString().padStart(3, "0")}`,
      roomTypeId: roomType.id,
      branchId,
      status: "AVAILABLE",
    }));

    await prisma.room.createMany({
      data: rooms,
    });

    // Connect features if any
    if (featureIds && featureIds.length > 0) {
      await prisma.roomType.update({
        where: { id: roomType.id },
        data: {
          roomFeatures: {
            connect: featureIds.map((id: number) => ({ id })),
          },
        },
      });
    }

    return NextResponse.json({ success: true, roomType });
  } catch (error) {
    console.error("Room creation error:", error);
    return NextResponse.json(
      { error: "Failed to create room type" },
      { status: 500 }
    );
  }
}
