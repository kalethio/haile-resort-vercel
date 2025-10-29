import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        branchName: true,
        heroImage: true,
        description: true,
        starRating: true,
        location: {
          select: {
            city: true,
            region: true,
          },
        },
        _count: {
          select: {
            packages: {
              where: { available: true },
            },
          },
        },
      },
      orderBy: { branchName: "asc" },
    });

    // ✅ ADD CACHING HEADERS for better performance
    const response = NextResponse.json(branches);

    // Cache for 5 minutes, serve stale while revalidating for 10 minutes
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Get branches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
