// app/api/admin/branches/[slug]/seo/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const { title, description, keywords } = await req.json();

    const branch = await prisma.branch.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const existingSeo = await prisma.branchSeo.findUnique({
      where: { branchId: branch.id },
    });

    if (existingSeo) {
      // Update existing SEO
      const updatedSeo = await prisma.branchSeo.update({
        where: { branchId: branch.id },
        data: {
          title,
          description,
          keywords,
        },
      });
      return NextResponse.json(updatedSeo);
    } else {
      // Create new SEO
      const newSeo = await prisma.branchSeo.create({
        data: {
          title,
          description,
          keywords,
          branchId: branch.id,
        },
      });
      return NextResponse.json(newSeo);
    }
  } catch (error) {
    console.error("SEO update error:", error);
    return NextResponse.json(
      { error: "Failed to update SEO" },
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

    const seo = await prisma.branchSeo.findUnique({
      where: { branchId: branch.id },
      select: {
        title: true,
        description: true,
        keywords: true,
      },
    });

    return NextResponse.json(seo || {});
  } catch (error) {
    console.error("SEO fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch SEO" }, { status: 500 });
  }
}
