import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { published: true },
      select: {
        slug: true,
        branchName: true,
      },
      orderBy: { branchName: "asc" },
    });

    const response = NextResponse.json(branches);

    // Shorter cache for navigation since it changes frequently
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );

    return response;
  } catch (error) {
    console.error("Get navigation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}
