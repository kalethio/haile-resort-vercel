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
            packages: {
              where: { available: true }, // ✅ Only include available packages
              orderBy: { price: "asc" }, // ✅ Order by price for better UX
            },
          },
          orderBy: { title: "asc" },
        },
        // ✅ ADD: Include standalone packages (not linked to experiences)
        packages: {
          where: {
            available: true,
            experienceId: null, // ✅ Packages without experience relation
          },
          orderBy: { price: "asc" },
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
