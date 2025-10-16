// app/api/news/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(news);
}

export async function POST(req: Request) {
  try {
    const body: { title: string; desc: string; detail: string } =
      await req.json();

    if (!body.title?.trim() || !body.desc?.trim() || !body.detail?.trim()) {
      return NextResponse.json(
        { error: "Title, description and detail are required" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title: body.title.trim(),
        desc: body.desc.trim(),
        detail: body.detail.trim(),
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const updates: {
      id?: number;
      title: string;
      desc: string;
      detail: string;
    }[] = await req.json();

    await prisma.news.deleteMany();

    const createdNews = await prisma.news.createMany({
      data: updates.map((news) => ({
        title: news.title,
        desc: news.desc,
        detail: news.detail,
      })),
    });

    return NextResponse.json({
      message: "News replaced",
      count: createdNews.count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
