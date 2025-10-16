import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params; // ✅ Await params

    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      include: {
        location: true,
        seo: true,
        contact: true,
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
    const { slug } = await params; // ✅ Await params
    const body = await req.json();

    const {
      branchName,
      description,
      heroImage,
      directionsUrl,
      starRating,
      published,
      location,
      seo,
    } = body;

    const branch = await prisma.branch.update({
      where: { slug: slug },
      data: {
        branchName,
        description,
        heroImage: heroImage || null,
        directionsUrl: directionsUrl || null,
        starRating: starRating || 4,
        published: published || false,
        location: {
          update: {
            city: location?.city || null,
            region: location?.region || null,
            country: location?.country || null,
          },
        },
        seo: {
          update: {
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

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Update branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { slug } = await params; // ✅ Await params

    await prisma.branch.delete({
      where: { slug: slug },
    });

    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Delete branch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
