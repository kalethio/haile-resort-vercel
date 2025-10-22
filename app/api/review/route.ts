// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: { name: string; text: string; email?: string } =
      await req.json();

    if (!body.name?.trim() || !body.text?.trim()) {
      return NextResponse.json(
        { error: "Name and text are required" },
        { status: 400 }
      );
    }

    // Get first branch as default
    const defaultBranch = await prisma.branch.findFirst();
    if (!defaultBranch) {
      return NextResponse.json(
        { error: "No branch available" },
        { status: 500 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        name: body.name.trim(),
        text: body.text.trim(),
        email: body.email?.trim() || null,
        approved: false,
        rating: 5, // Required field
        branchId: defaultBranch.id, // Required field
      },
    });

    return NextResponse.json(
      { message: "Review submitted", id: newReview.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
