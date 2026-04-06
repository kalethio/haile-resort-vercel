import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - Get single room type by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const roomTypeId = parseInt(id);

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
    const { id } = await params;
    const roomTypeId = parseInt(id);

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

// PUT - Update full room type with images
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const roomTypeId = parseInt(id);

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
      images,
      imagesToDelete,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Room type name is required" },
        { status: 400 }
      );
    }

    const existingRoomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: {
        branch: true,
        roomTypeMedia: {
          include: { media: true },
        },
      },
    });

    if (!existingRoomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

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

    // Handle image deletion
    if (imagesToDelete && imagesToDelete.length > 0) {
      const mediaToDelete = existingRoomType.roomTypeMedia.filter((rtm) =>
        imagesToDelete.includes(rtm.media.url)
      );

      for (const media of mediaToDelete) {
        // Delete physical file if exists
        try {
          const filePath = path.join(process.cwd(), "public", media.media.url);
          await fs.unlink(filePath).catch(() => {});
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        // Delete database records
        await prisma.roomTypeMedia.delete({
          where: { id: media.id },
        });

        await prisma.mediaAsset.delete({
          where: { id: media.mediaId },
        });
      }
    }

    // Handle images to keep
    const currentImageUrls = existingRoomType.roomTypeMedia.map(
      (rtm) => rtm.media.url
    );

    const newImageUrls =
      images?.filter((url: string) => !currentImageUrls.includes(url)) || [];

    let orderCounter = existingRoomType.roomTypeMedia.length;

    for (const imageUrl of newImageUrls) {
      const filename = imageUrl.split("/").pop() || "unknown";

      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          url: imageUrl,
          filename: filename,
          type: "image",
          branchId: existingRoomType.branchId,
        },
      });

      await prisma.roomTypeMedia.create({
        data: {
          roomTypeId: roomTypeId,
          mediaId: mediaAsset.id,
          order: orderCounter++,
        },
      });
    }

    // Update room type basic info
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
    const { id } = await params;
    const roomTypeId = parseInt(id);

    if (isNaN(roomTypeId)) {
      return NextResponse.json(
        { error: "Invalid room type ID" },
        { status: 400 }
      );
    }

    const existingRoomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      include: {
        rooms: {
          include: {
            roomBookings: true,
          },
        },
        roomTypeMedia: {
          include: { media: true },
        },
      },
    });

    if (!existingRoomType) {
      return NextResponse.json(
        { error: "Room type not found" },
        { status: 404 }
      );
    }

    const hasBookings = existingRoomType.rooms.some(
      (room) => room.roomBookings && room.roomBookings.length > 0
    );

    if (hasBookings) {
      return NextResponse.json(
        {
          error:
            "Cannot delete room type with existing bookings. Please cancel or complete all bookings first.",
        },
        { status: 400 }
      );
    }

    // Delete image files from disk
    for (const media of existingRoomType.roomTypeMedia) {
      try {
        const filePath = path.join(process.cwd(), "public", media.media.url);
        await fs.unlink(filePath).catch(() => {});
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    // Delete room type media associations
    if (existingRoomType.roomTypeMedia.length > 0) {
      await prisma.roomTypeMedia.deleteMany({
        where: { roomTypeId: roomTypeId },
      });

      // Delete media assets
      const mediaIds = existingRoomType.roomTypeMedia.map((m) => m.mediaId);
      await prisma.mediaAsset.deleteMany({
        where: { id: { in: mediaIds } },
      });
    }

    // Delete rooms
    if (existingRoomType.rooms.length > 0) {
      const roomIds = existingRoomType.rooms.map((room) => room.id);

      await prisma.roomBooking.deleteMany({
        where: {
          roomId: { in: roomIds },
        },
      });

      await prisma.room.deleteMany({
        where: { roomTypeId: roomTypeId },
      });
    }

    // Delete the room type
    await prisma.roomType.delete({
      where: { id: roomTypeId },
    });

    return NextResponse.json({
      success: true,
      message: "Room type and all associated data deleted successfully",
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
      {
        error:
          "Failed to delete room type. Please ensure no active bookings exist.",
      },
      { status: 500 }
    );
  }
}
