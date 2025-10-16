// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  try {
    const body: { name: string; text: string } = await req.json();

    if (!body.name?.trim() || !body.text?.trim()) {
      return NextResponse.json(
        { error: "Name and text are required" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        name: body.name.trim(),
        text: body.text.trim(),
        approved: false,
      },
    });

    return NextResponse.json(
      { message: "Review submitted", id: newReview.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
