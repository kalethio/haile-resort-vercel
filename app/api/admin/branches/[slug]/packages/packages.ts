import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const { experienceId, packages } = body;

    if (!experienceId) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    // Verify experience belongs to branch
    const experience = await prisma.experience.findFirst({
      where: {
        id: experienceId,
        branch: { slug: params.slug },
      },
      include: {
        branch: {
          select: { id: true },
        },
      },
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found for this branch" },
        { status: 404 }
      );
    }

    // Update packages for specific experience
    await prisma.$transaction([
      prisma.package.deleteMany({
        where: { experienceId },
      }),
      ...packages.map((pkg: any) =>
        prisma.package.create({
          data: {
            // ✅ UPDATED: Include all new fields
            externalId: pkg.id || pkg.externalId || null,
            title: pkg.title,
            subtitle: pkg.subtitle || null,
            description: pkg.description || null,
            image: pkg.image || null,
            price: pkg.price || null, // ✅ NEW
            duration: pkg.duration || null, // ✅ NEW
            inclusions: pkg.inclusions || null, // ✅ NEW
            category: pkg.category || "CULTURAL", // ✅ NEW
            available: pkg.available ?? true, // ✅ NEW
            ctaLabel: pkg.ctaLabel || null,
            experienceId,
            branchId: experience.branch.id, // ✅ NEW: Required field
          },
        })
      ),
    ]);

    const updatedPackages = await prisma.package.findMany({
      where: { experienceId },
    });

    return NextResponse.json(updatedPackages);
  } catch (error) {
    console.error("Packages update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
