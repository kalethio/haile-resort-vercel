//app/api/admin/branches/[slug]/route.ts
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

    // ✅ RETURN EXACT SAME STRUCTURE AS BRANCH PAGE API
    return NextResponse.json({
      slug: branch.slug,
      branchName: branch.branchName,
      description: branch.description,
      heroImage: branch.heroImage,
      directionsUrl: branch.directionsUrl,
      starRating: branch.starRating,
      published: branch.published,
      // NEW FIELDS ADDED:
      heroVideoUrl: branch.heroVideoUrl,
      heroTagline: branch.heroTagline,
      location: branch.location,
      contact: branch.contact,
      // ✅ CRITICAL: Return the raw arrays without transformation
      attractions: branch.attractions,
      accommodations: branch.accommodations,
      experiences: branch.experiences,
    });
  } catch (error) {
    console.error("Edit form GET error:", error);
    return NextResponse.json(
      { error: "Failed to load branch data" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const updates = await req.json();

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    const existingBranch = await prisma.branch.findFirst({
      where: { slug },
    });

    if (!existingBranch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // UPDATED: Added new fields to valid list
    const validBranchFields = [
      "slug",
      "branchName",
      "description",
      "heroImage",
      "directionsUrl",
      "starRating",
      "published",
      "heroVideoUrl", // NEW
      "heroTagline", // NEW
    ];

    const filteredBranchUpdates = Object.keys(updates)
      .filter((key) => validBranchFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    const updatedBranch = await prisma.branch.update({
      where: { id: existingBranch.id },
      data: filteredBranchUpdates,
    });

    return NextResponse.json({
      success: true,
      message: "Branch core data updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("PATCH branch error:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    );
  }
}

// DELETE method remains unchanged
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const branch = await prisma.branch.findFirst({
      where: { slug },
      select: { id: true, branchName: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    await prisma.branch.delete({
      where: { id: branch.id },
    });

    const response = NextResponse.json({
      success: true,
      message: `Branch "${branch.branchName}" deleted successfully`,
    });

    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("DELETE branch error:", error);
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
