import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    const branch = await prisma.branch.findFirst({
      where: {
        slug: slug,
        published: true,
      },
      include: {
        location: true,
        contact: true,
        seo: true,
        attractions: true,
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

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Get branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const updates = await req.json();

    // Validate required data
    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    // Find the branch first
    const existingBranch = await prisma.branch.findFirst({
      where: { slug },
    });

    if (!existingBranch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Extract nested data safely
    const { location, seo, contact, ...branchUpdates } = updates;

    // Get valid Branch model fields (remove invalid fields like 'phone')
    const validBranchFields = [
      "slug",
      "branchName",
      "description",
      "heroImage",
      "directionsUrl",
      "starRating",
      "published",
    ];
    const filteredBranchUpdates = Object.keys(branchUpdates)
      .filter((key) => validBranchFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = branchUpdates[key];
        return obj;
      }, {} as any);

    // Update only the main branch data with filtered fields
    const updatedBranch = await prisma.branch.update({
      where: { id: existingBranch.id },
      data: filteredBranchUpdates,
    });

    // Update contact if provided and valid (phone belongs here)
    if (contact && typeof contact === "object") {
      try {
        await prisma.contact.upsert({
          where: { branchId: existingBranch.id },
          update: contact,
          create: {
            ...contact,
            branchId: existingBranch.id,
          },
        });
      } catch (contactError) {
        console.error("Contact update error:", contactError);
      }
    }

    // Update location if provided and valid
    if (location && typeof location === "object") {
      try {
        await prisma.location.upsert({
          where: { branchId: existingBranch.id },
          update: location,
          create: {
            ...location,
            branchId: existingBranch.id,
          },
        });
      } catch (locationError) {
        console.error("Location update error:", locationError);
      }
    }

    // Update SEO if provided and valid
    if (seo && typeof seo === "object") {
      try {
        await prisma.seo.upsert({
          where: { branchId: existingBranch.id },
          update: seo,
          create: {
            ...seo,
            branchId: existingBranch.id,
          },
        });
      } catch (seoError) {
        console.error("SEO update error:", seoError);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Branch updated successfully",
    });
  } catch (error) {
    console.error("PATCH branch error:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
      { status: 500 }
    );
  }
}
