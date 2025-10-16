// app/api/admin/branches/[slug]/attractions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const attractions = body.attractions || [];

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Delete existing and create new attractions
    await prisma.$transaction([
      prisma.attraction.deleteMany({
        where: { branchId: branch.id },
      }),
      ...attractions.map((attraction: any) =>
        prisma.attraction.create({
          data: {
            externalId: attraction.id || null,
            label: attraction.label,
            image: attraction.image || null,
            branchId: branch.id,
          },
        })
      ),
    ]);

    const updatedAttractions = await prisma.attraction.findMany({
      where: { branchId: branch.id },
    });

    return NextResponse.json(updatedAttractions);
  } catch (error) {
    console.error("Attractions update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
