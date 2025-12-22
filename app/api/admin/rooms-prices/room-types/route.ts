// app/api/admin/rooms-prices/room-types/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branchSlug");

    if (!branchSlug) {
      return NextResponse.json(
        { error: "Branch slug required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const roomTypes = await prisma.roomType.findMany({
      where: { branchId: branch.id },
      include: {
        rooms: {
          where: { status: "AVAILABLE" },
        },
        roomFeatures: true,
        roomTypeMedia: {
          include: { media: true },
          orderBy: { order: "asc" },
        },
      },
    });

    const roomTypesWithAvailability = roomTypes.map((roomType) => ({
      ...roomType,
      availableRooms: roomType.rooms.length,
      amenities: roomType.amenities || [],
      images: roomType.roomTypeMedia.map((rtm) => rtm.media.url),
    }));

    return NextResponse.json(roomTypesWithAvailability);
  } catch (error) {
    console.error("Room types fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const branchSlug = url.searchParams.get("branchSlug");

    const {
      name,
      description,
      adultCapacity,
      childCapacity,
      basePrice,
      totalRooms,
      amenities,
      images,
    } = body;

    if (!name || !branchSlug) {
      return NextResponse.json(
        { error: "Name and branch slug are required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const parsedAdultCapacity = parseInt(adultCapacity) || 2;
    const parsedChildCapacity = parseInt(childCapacity) || 0;
    const parsedBasePrice = parseFloat(basePrice) || 0;
    const parsedTotalRooms = parseInt(totalRooms) || 1;

    const roomType = await prisma.roomType.create({
      data: {
        name,
        description: description || "",
        capacity: parsedAdultCapacity,
        childrenCapacity: parsedChildCapacity,
        basePrice: parsedBasePrice,
        totalRooms: parsedTotalRooms,
        branchId: branch.id,
        amenities: amenities || [],
        available: true,
      },
    });

    const rooms = Array.from({ length: parsedTotalRooms }, (_, i) => ({
      roomNumber: `RT${roomType.id.toString().padStart(3, "0")}${(i + 1).toString().padStart(2, "0")}`,
      roomTypeId: roomType.id,
      branchId: branch.id,
      status: "AVAILABLE",
    }));

    await prisma.room.createMany({ data: rooms });

    if (images && images.length > 0) {
      try {
        const mediaAssets = await Promise.all(
          images.map(async (imageUrl: string, index: number) => {
            const filename =
              imageUrl.split("/").pop() ||
              `room-${roomType.id}-${index + 1}.jpg`;

            return await prisma.mediaAsset.create({
              data: {
                filename,
                url: imageUrl,
                type: "image",
                branchId: branch.id,
              },
            });
          })
        );

        await Promise.all(
          mediaAssets.map((mediaAsset, index) =>
            prisma.roomTypeMedia.create({
              data: {
                roomTypeId: roomType.id,
                mediaId: mediaAsset.id,
                isHighlight: index === 0,
                order: index,
              },
            })
          )
        );
      } catch (imageError) {
        console.error("Error creating media records:", imageError);
      }
    }

    return NextResponse.json({
      success: true,
      roomType: { ...roomType, images: images || [] },
      message: `Created ${parsedTotalRooms} rooms of type ${name}`,
    });
  } catch (error) {
    console.error("Room creation error:", error);
    return NextResponse.json(
      { error: "Failed to create room type: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const branchSlug = url.searchParams.get("branchSlug");
    const roomTypeId = url.searchParams.get("roomTypeId");

    if (!branchSlug || !roomTypeId) {
      return NextResponse.json(
        { error: "Branch slug and room type ID are required" },
        { status: 400 }
      );
    }

    const parsedRoomTypeId = parseInt(roomTypeId);
    if (isNaN(parsedRoomTypeId)) {
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

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const roomType = await prisma.roomType.findFirst({
      where: {
        id: parsedRoomTypeId,
        branchId: branch.id,
      },
    });

    if (!roomType) {
      return NextResponse.json(
        { error: "Room type not found in this branch" },
        { status: 404 }
      );
    }

    const updatedRoomType = await prisma.roomType.update({
      where: { id: parsedRoomTypeId },
      data: { basePrice: parseFloat(basePrice) },
    });

    return NextResponse.json({
      success: true,
      roomType: updatedRoomType,
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

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const branchSlug = url.searchParams.get("branchSlug");
    const roomTypeId = url.searchParams.get("roomTypeId");

    if (!branchSlug || !roomTypeId) {
      return NextResponse.json(
        { error: "Branch slug and room type ID are required" },
        { status: 400 }
      );
    }

    const parsedRoomTypeId = parseInt(roomTypeId);
    if (isNaN(parsedRoomTypeId)) {
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

    if (!name) {
      return NextResponse.json(
        { error: "Room type name is required" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const existingRoomType = await prisma.roomType.findFirst({
      where: {
        id: parsedRoomTypeId,
        branchId: branch.id,
      },
    });

    if (!existingRoomType) {
      return NextResponse.json(
        { error: "Room type not found in this branch" },
        { status: 404 }
      );
    }

    const duplicateRoomType = await prisma.roomType.findFirst({
      where: {
        branchId: branch.id,
        name,
        id: { not: parsedRoomTypeId },
      },
    });

    if (duplicateRoomType) {
      return NextResponse.json(
        { error: `Room type "${name}" already exists in this branch` },
        { status: 400 }
      );
    }

    const updatedRoomType = await prisma.roomType.update({
      where: { id: parsedRoomTypeId },
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
      roomType: updatedRoomType,
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
