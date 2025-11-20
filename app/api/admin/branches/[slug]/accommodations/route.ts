import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const accommodations = body.accommodations || [];

    console.log("🔄 ACCOMMODATIONS API - Saving:", {
      slug,
      accommodationsCount: accommodations.length,
      accommodationsData: accommodations,
    });

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      select: { id: true },
    });

    if (!branch) {
      console.log("❌ ACCOMMODATIONS API - Branch not found:", slug);
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    console.log("🔄 ACCOMMODATIONS API - Found branch ID:", branch.id);

    // ✅ FIX: Only create new accommodations, don't delete existing ones
    const createdAccommodations = await Promise.all(
      accommodations.map((acc: any) =>
        prisma.accommodation.create({
          data: {
            title: acc.title,
            description: acc.description || null,
            image: acc.image || null,
            branchId: branch.id,
          },
        })
      )
    );

    console.log("✅ ACCOMMODATIONS API - Saved successfully:", {
      savedCount: createdAccommodations.length,
      savedData: createdAccommodations,
    });

    return NextResponse.json(createdAccommodations);
  } catch (error) {
    console.error("❌ ACCOMMODATIONS API - Error:", error);
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

    const accommodations = await prisma.accommodation.findMany({
      where: { branchId: branch.id },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
      },
    });

    return NextResponse.json(accommodations);
  } catch (error) {
    console.error("Accommodations fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
