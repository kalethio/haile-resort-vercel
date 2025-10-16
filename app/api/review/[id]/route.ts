// app/api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id) || id < 1) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body: { approved?: boolean } = await req.json();

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { approved: body.appointed },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id) || id < 1) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
