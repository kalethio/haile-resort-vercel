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

    // Delete existing experiences and packages
    await prisma.$transaction([
      prisma.package.deleteMany({
        where: {
          experience: {
            branchId: branch.id,
          },
        },
      }),
      prisma.experience.deleteMany({
        where: { branchId: branch.id },
      }),
      ...experiences.map((exp: any) =>
        prisma.experience.create({
          data: {
            externalId: exp.externalId || null,
            title: exp.title,
            description: exp.description || null,
            highlightImage: exp.highlightImage || null,
            branchId: branch.id,
            packages: {
              create: (exp.packages || []).map((pkg: any) => ({
                // ✅ UPDATED: Include all new fields
                externalId: pkg.id || pkg.externalId || null,
                title: pkg.title,
                subtitle: pkg.subtitle || null,
                description: pkg.description || null,
                image: pkg.image || null,
                price: pkg.price || null, // ✅ NEW
                duration: pkg.duration || null, // ✅ NEW
                inclusions: pkg.inclusions || null, // ✅ NEW
                category: pkg.category || "CULTURAL", // ✅ NEW (default category)
                available: pkg.available ?? true, // ✅ NEW
                ctaLabel: pkg.ctaLabel || null,
                branchId: branch.id, // ✅ NEW: Required field
              })),
            },
          },
        })
      ),
    ]);

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
