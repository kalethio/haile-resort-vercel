// app/api/branches/[slug]/accommodations/route.ts (public, no auth)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const branch = await prisma.branch.findFirst({
    where: { slug },
    select: { id: true },
  });

  if (!branch) {
    return NextResponse.json([], { status: 200 });
  }

  const accommodations = await prisma.accommodation.findMany({
    where: { branchId: branch.id },
    select: { title: true, description: true, image: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(accommodations);
}
