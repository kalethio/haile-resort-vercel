import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Find branch
    const branch = await prisma.branch.findFirst({
      where: {
        slug: slug,
        published: true,
      },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Build where clause for packages
    const whereClause: any = {
      branchId: branch.id,
      available: true,
    };

    // Add category filter if provided
    if (category && category !== "all") {
      whereClause.category = category;
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      include: {
        experience: {
          select: {
            title: true,
            highlightImage: true,
          },
        },
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Get branch packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
