//app/api/admin/branches/[slug]/attractions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const attractions = body.attractions || [];

    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const createdAttractions = await Promise.all(
      attractions.map((attraction: any) =>
        prisma.attraction.create({
          data: {
            externalId: attraction.externalId
              ? String(attraction.externalId)
              : null,
            label: attraction.label,
            image: attraction.image || null,
            order: attraction.order || 0,
            branchId: branch.id,
          },
        })
      )
    );

    return NextResponse.json(createdAttractions);
  } catch (error) {
    console.error("Attractions update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const branch = await prisma.branch.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const attractions = await prisma.attraction.findMany({
      where: { branchId: branch.id },
      select: {
        id: true,
        label: true,
        image: true,
        externalId: true,
        order: true,
      },
      orderBy: { order: "asc" }, // NEW: Added ordering
    });

    return NextResponse.json(attractions);
  } catch (error) {
    console.error("Attractions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
