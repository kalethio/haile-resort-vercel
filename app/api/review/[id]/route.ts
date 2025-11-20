import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (Number.isNaN(reviewId) || reviewId < 1) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body: { action?: string; approved?: boolean } = await req.json();

    // Handle both action format and direct approved format
    const approved = body.action === "approve" ? true : body.approved;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { approved: approved },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (Number.isNaN(reviewId) || reviewId < 1) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id: reviewId } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
