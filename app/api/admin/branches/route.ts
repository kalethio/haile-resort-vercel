// app/api/admin/branches/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      branchName,
      description,
      heroImage,
      directionsUrl,
      starRating,
      published,
      location,
      seo,
    } = body;

    // Validate required fields
    if (!slug || !branchName || !description) {
      return NextResponse.json(
        { error: "Slug, branch name, and description are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBranch = await prisma.branch.findUnique({
      where: { slug },
    });

    if (existingBranch) {
      return NextResponse.json(
        { error: "Branch with this slug already exists" },
        { status: 409 }
      );
    }

    // Create branch with nested relations
    const branch = await prisma.branch.create({
      data: {
        slug,
        branchName,
        description,
        heroImage: heroImage || null,
        directionsUrl: directionsUrl || null,
        starRating: starRating || 4,
        published: published || false,
        location: {
          create: {
            city: location?.city || null,
            region: location?.region || null,
            country: location?.country || null,
          },
        },
        seo: {
          create: {
            title: seo?.title || null,
            description: seo?.description || null,
            keywords: seo?.keywords || [],
          },
        },
      },
      include: {
        location: true,
        seo: true,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Create branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        location: true,
        seo: true,
        contact: true,
        _count: {
          select: {
            attractions: true,
            accommodations: true,
            experiences: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error("Get branches error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
