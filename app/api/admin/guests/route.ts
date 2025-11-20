// /app/api/admin/guests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const search = searchParams.get("search");

    // Build where clause
    let whereClause: any = {};

    // Branch filtering
    if (branchSlug && branchSlug !== "all") {
      const branch = await prisma.branch.findUnique({
        where: { slug: branchSlug },
      });
      if (branch) {
        whereClause.branchId = branch.id;
      }
    }

    // Search filtering
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const guests = await prisma.guest.findMany({
      where: whereClause,
      include: {
        branch: {
          select: {
            branchName: true,
            slug: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      guests: guests.map((guest) => ({
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        createdAt: guest.createdAt.toISOString(),
        branch: guest.branch,
        _count: guest._count,
      })),
    });
  } catch (error) {
    console.error("Admin guests fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 }
    );
  }
}
