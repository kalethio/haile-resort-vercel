import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get("branch");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");

    const where = {
      ...(branch && { branch: { slug: branch } }),
      ...(status && { status }),
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        branch: { select: { branchName: true, slug: true } },
        roomBookings: {
          include: {
            room: {
              include: { roomType: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
    });

    const total = await prisma.booking.count({ where });

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / 20),
      },
    });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
