import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { published: true },
      select: {
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
        // ✅ ADD: Include package counts for frontend display
        _count: {
          select: {
            packages: {
              where: { available: true }, // ✅ Only count available packages
            },
          },
        },
      },
      orderBy: { branchName: "asc" },
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error("Get branches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
