// app/api/review/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body: { action?: "approve" } = await req.json();

  if (body.action === "approve") {
    await prisma.review.update({ where: { id }, data: { approved: true } });
    return NextResponse.json({ message: "Approved" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
