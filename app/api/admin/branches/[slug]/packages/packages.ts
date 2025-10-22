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

    // ✅ FIX: Only create new packages, don't delete existing ones
    const createdPackages = await Promise.all(
      packages.map((pkg: any) =>
        prisma.package.create({
          data: {
            externalId: pkg.id || pkg.externalId || null,
            title: pkg.title,
            subtitle: pkg.subtitle || null,
            description: pkg.description || null,
            image: pkg.image || null,
            price: pkg.price || null,
            duration: pkg.duration || null,
            inclusions: pkg.inclusions || null,
            category: pkg.category || "CULTURAL",
            available: pkg.available ?? true,
            ctaLabel: pkg.ctaLabel || null,
            experienceId,
            branchId: experience.branch.id,
          },
        })
      )
    );

    return NextResponse.json(createdPackages);
  } catch (error) {
    console.error("Packages update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
