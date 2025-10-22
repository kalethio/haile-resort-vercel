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

    // ✅ FIX: Only create new experiences, don't delete existing ones
    const createdExperiences = await Promise.all(
      experiences.map((exp: any) =>
        prisma.experience.create({
          data: {
            externalId: exp.externalId || null,
            title: exp.title,
            description: exp.description || null,
            highlightImage: exp.highlightImage || null,
            branchId: branch.id,
            packages: {
              create: (exp.packages || []).map((pkg: any) => ({
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
