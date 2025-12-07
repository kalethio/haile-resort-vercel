//app/aip / branches / [slug] / route.ts;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const branch = await prisma.branch.findFirst({
      where: { slug },
      include: {
        location: true,
        contact: true,
        attractions: {
          orderBy: { order: "asc" }, // NEW: Added ordering
        },
        accommodations: true,
        experiences: {
          include: {
            packages: true,
          },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // ✅ Return the EXACT structure that EditBranchForm expects
    return NextResponse.json({
      slug: branch.slug,
      branchName: branch.branchName,
      description: branch.description || "",
      heroImage: branch.heroImage || "",
      directionsUrl: branch.directionsUrl || "",
      starRating: branch.starRating || 4,
      published: branch.published || false,
      // NEW FIELDS ADDED:
      heroVideoUrl: branch.heroVideoUrl || "",
      heroTagline: branch.heroTagline || "",
      location: {
        city: branch.location?.city || "",
        region: branch.location?.region || "",
        country: branch.location?.country || "Ethiopia",
      },
      contact: {
        phone: branch.contact?.phone || "",
        email: branch.contact?.email || "",
        address: branch.contact?.address || "",
      },
      attractions: branch.attractions,
      accommodations: branch.accommodations,
      experiences: branch.experiences.map((exp) => ({
        ...exp,
        packages: exp.packages || [],
      })),
    });
  } catch (error) {
    console.error("Branch page GET error:", error);
    return NextResponse.json(
      { error: "Failed to load branch data" },
      { status: 500 }
    );
  }
}
