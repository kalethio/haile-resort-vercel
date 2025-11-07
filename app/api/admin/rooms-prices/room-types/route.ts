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

    // Find branch by slug first
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const roomTypes = await prisma.roomType.findMany({
      where: {
        branchId: branch.id,
      },
      include: {
        rooms: {
          where: {
            status: "AVAILABLE",
          },
        },
        roomFeatures: true,
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
    console.log("Raw request body:", body);

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

    // Get branchSlug from URL instead of request body
    const url = new URL(request.url);
    const branchSlug = url.searchParams.get("branchSlug");

    console.log("Parsed values:", {
      name,
      description,
      adultCapacity,
      childCapacity,
      basePrice,
      totalRooms,
      branchSlug,
      amenities,
      images,
    });

    // Validate required fields
    if (!name || !branchSlug) {
      return NextResponse.json(
        { error: "Name and branch slug are required" },
        { status: 400 }
      );
    }

    // Find branch by slug
    const branch = await prisma.branch.findUnique({
      where: { slug: branchSlug },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Parse numbers safely
    const parsedAdultCapacity = parseInt(adultCapacity) || 2;
    const parsedChildCapacity = parseInt(childCapacity) || 0;
    const parsedBasePrice = parseFloat(basePrice) || 0;
    const parsedTotalRooms = parseInt(totalRooms) || 1;

    console.log("Parsed numbers:", {
      branchId: branch.id,
      parsedAdultCapacity,
      parsedChildCapacity,
      parsedBasePrice,
      parsedTotalRooms,
    });

    // Create room type
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

    console.log(`Created room type: ${roomType.name} with ID: ${roomType.id}`);

    // Create individual rooms with UNIQUE room numbers
    const rooms = Array.from({ length: parsedTotalRooms }, (_, i) => ({
      roomNumber: `RT${roomType.id.toString().padStart(3, "0")}${(i + 1).toString().padStart(2, "0")}`,
      roomTypeId: roomType.id,
      branchId: branch.id,
      status: "AVAILABLE",
    }));

    await prisma.room.createMany({
      data: rooms,
    });

    console.log(
      `Successfully created ${parsedTotalRooms} rooms for type: ${name}`
    );

    // Handle image uploads and create media records
    if (images && images.length > 0) {
      console.log(
        `Processing ${images.length} images for room type ${roomType.id}`
      );

      try {
        // Create MediaAsset records for each image
        const mediaAssets = await Promise.all(
          images.map(async (imageUrl: string, index: number) => {
            const filename =
              imageUrl.split("/").pop() ||
              `room-${roomType.id}-${index + 1}.jpg`;

            const mediaAsset = await prisma.mediaAsset.create({
              data: {
                filename: filename,
                url: imageUrl,
                type: "image",
                branchId: branch.id,
              },
            });

            console.log(`Created media asset: ${mediaAsset.filename}`);
            return mediaAsset;
          })
        );

        // Link images to room type via RoomTypeMedia
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

        console.log(
          `Successfully linked ${mediaAssets.length} images to room type ${roomType.id}`
        );
      } catch (imageError) {
        console.error("Error creating media records:", imageError);
        // Don't fail the entire request if image linking fails
      }
    }

    return NextResponse.json({
      success: true,
      roomType: {
        ...roomType,
        images: images || [],
      },
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
