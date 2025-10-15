// src/app/api/branches/[slug]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // ✅ Explicitly select phone and email
    const branch = await prisma.branch.findUnique({
      where: { slug },
      select: {
        id: true,
        branchName: true,
        heroImage: true,
        description: true,
        directionsUrl: true,
        phone: true, // include phone
        email: true, // include email
        attractions: true,
        accommodations: true,
        experiences: {
          include: { packages: true },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // ✅ Create a consistent contact object
    const response = {
      ...branch,
      contact: {
        phone: branch.phone || null,
        email: branch.email || null,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
