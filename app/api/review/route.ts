import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const reviews = await prisma.review.findMany();
  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const body: { name: string; text: string } = await req.json();
  if (!body.name || !body.text)
    return NextResponse.json(
      { error: "Missing name or text" },
      { status: 400 }
    );

  const newReview = await prisma.review.create({
    data: { name: body.name, text: body.text, approved: false },
  });

  return NextResponse.json(
    { message: "Review submitted", id: newReview.id },
    { status: 201 }
  );
}
