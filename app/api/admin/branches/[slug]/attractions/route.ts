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

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // ✅ FIX: Only create new attractions, don't delete existing ones
    const createdAttractions = await Promise.all(
      attractions.map((attraction: any) =>
        prisma.attraction.create({
          data: {
            externalId: attraction.id || null,
            label: attraction.label,
            image: attraction.image || null,
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
