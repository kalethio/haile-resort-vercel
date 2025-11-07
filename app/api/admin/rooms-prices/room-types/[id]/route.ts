// app/api/admin/rooms-prices/room-types/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - Get single room type by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const roomTypeId = parseInt(params.id);

    if (isNaN(roomTypeId)) {
      return NextResponse.json(
        { error: "Invalid room type ID" },
        { status: 400 }
      );
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: {
        rooms: true,
        roomTypeMedia: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!roomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    // Format response to match what the frontend expects
    const formattedRoomType = {
      id: roomType.id,
      name: roomType.name,
      description: roomType.description,
      adultCapacity: roomType.capacity,
      childCapacity: roomType.childrenCapacity,
      basePrice: roomType.basePrice,
      totalRooms: roomType.totalRooms,
      amenities: Array.isArray(roomType.amenities) ? roomType.amenities : [],
      images: roomType.roomTypeMedia.map((rtm) => rtm.media.url),
    };

    return NextResponse.json(formattedRoomType);
  } catch (error) {
    console.error("Room type fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room type" },
      { status: 500 }
    );
  }
}

// PATCH - Update room type price only
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const roomTypeId = parseInt(params.id);

    if (isNaN(roomTypeId)) {
      return NextResponse.json(
        { error: "Invalid room type ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { basePrice } = body;

    if (basePrice === undefined || basePrice < 0) {
      return NextResponse.json(
        { error: "Valid base price is required" },
        { status: 400 }
      );
    }

    const roomType = await prisma.roomType.update({
      where: { id: roomTypeId },
      data: {
        basePrice: parseFloat(basePrice),
      },
    });

    return NextResponse.json({
      success: true,
      roomType,
      message: "Price updated successfully",
    });
  } catch (error) {
    console.error("Room type price update error:", error);

    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update room type price" },
      { status: 500 }
    );
  }
}

// PUT - Update full room type
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const roomTypeId = parseInt(params.id);

    if (isNaN(roomTypeId)) {
      return NextResponse.json(
        { error: "Invalid room type ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      adultCapacity,
      childCapacity,
      basePrice,
      totalRooms,
      amenities,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Room type name is required" },
        { status: 400 }
      );
    }

    // Check if room type exists and belongs to the same branch
    const existingRoomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: { branch: true },
    });

    if (!existingRoomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    // Check for duplicate name in the same branch (excluding current room type)
    const duplicateRoomType = await prisma.roomType.findFirst({
      where: {
        branchId: existingRoomType.branchId,
        name: name,
        id: { not: roomTypeId },
      },
    });

    if (duplicateRoomType) {
      return NextResponse.json(
        { error: `Room type "${name}" already exists in this branch` },
        { status: 400 }
      );
    }

    // Update room type
    const roomType = await prisma.roomType.update({
      where: { id: roomTypeId },
      data: {
        name,
        description: description || "",
        capacity: parseInt(adultCapacity) || 2,
        childrenCapacity: parseInt(childCapacity) || 0,
        basePrice: parseFloat(basePrice) || 0,
        totalRooms: parseInt(totalRooms) || 1,
        amenities: amenities || [],
      },
    });

    return NextResponse.json({
      success: true,
      roomType,
      message: "Room type updated successfully",
    });
  } catch (error) {
    console.error("Room type update error:", error);

    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update room type" },
      { status: 500 }
    );
  }
}

// DELETE - Delete room type
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const roomTypeId = parseInt(params.id);

    if (isNaN(roomTypeId)) {
      return NextResponse.json(
        { error: "Invalid room type ID" },
        { status: 400 }
      );
    }

    await prisma.roomType.delete({
      where: { id: roomTypeId },
    });

    return NextResponse.json({
      success: true,
      message: "Room type deleted successfully",
    });
  } catch (error) {
    console.error("Room type delete error:", error);

    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete room type" },
      { status: 500 }
    );
  }
}
