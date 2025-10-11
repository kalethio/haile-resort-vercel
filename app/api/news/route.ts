import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → fetch all news
export async function GET() {
  const news = await prisma.news.findMany();
  return NextResponse.json(news);
}

// PUT → update news (replace all)
export async function PUT(req: Request) {
  const body: { title: string; desc: string; detail: string }[] =
    await req.json();

  // delete all existing
  await prisma.news.deleteMany();

  // insert new
  for (const n of body) {
    await prisma.news.create({ data: n });
  }

  return NextResponse.json({ message: "News updated" });
}
