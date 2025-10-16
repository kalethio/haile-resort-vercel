// app/api/admin/branches/[slug]/accommodations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const accommodations = body.accommodations || [];

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Delete existing and create new accommodations
    await prisma.$transaction([
      prisma.accommodation.deleteMany({
        where: { branchId: branch.id },
      }),
      ...accommodations.map((acc: any) =>
        prisma.accommodation.create({
          data: {
            title: acc.title,
            description: acc.description || null,
            image: acc.image || null,
            branchId: branch.id,
          },
        })
      ),
    ]);

    const updatedAccommodations = await prisma.accommodation.findMany({
      where: { branchId: branch.id },
    });

    return NextResponse.json(updatedAccommodations);
  } catch (error) {
    console.error("Accommodations update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
