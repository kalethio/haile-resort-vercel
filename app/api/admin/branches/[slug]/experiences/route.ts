import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const experiences = body.experiences || [];

    // Find branch ID
    const branch = await prisma.branch.findFirst({
      where: { slug: slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // ✅ FIXED: Convert externalId to string for experiences AND packages
    const createdExperiences = await Promise.all(
      experiences.map((exp: any) =>
        prisma.experience.create({
          data: {
            externalId: exp.externalId ? String(exp.externalId) : null, // Convert to string
            title: exp.title,
            description: exp.description || null,
            highlightImage: exp.highlightImage || null,
            branchId: branch.id,
            packages: {
              create: (exp.packages || []).map((pkg: any) => ({
                externalId: pkg.externalId ? String(pkg.externalId) : null, // Convert to string
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
                branchId: branch.id,
              })),
            },
          },
        })
      )
    );

    const updatedExperiences = await prisma.experience.findMany({
      where: { branchId: branch.id },
      include: {
        packages: true,
      },
    });

    return NextResponse.json(updatedExperiences);
  } catch (error) {
    console.error("Experiences update error:", error);
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

    const experiences = await prisma.experience.findMany({
      where: { branchId: branch.id },
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            description: true,
            price: true,
            duration: true,
            category: true,
            available: true,
            ctaLabel: true,
          },
        },
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Experiences fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
