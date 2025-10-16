// app/api/branches/route.ts
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
      },
      orderBy: { branchName: "asc" },
    });

    return NextResponse.json(branches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
