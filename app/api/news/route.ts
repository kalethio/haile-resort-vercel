import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Map back to frontend expected format
    const mappedNews = news.map((article) => ({
      id: article.id,
      title: article.title,
      desc: article.excerpt, // Map excerpt back to desc
      detail: article.content, // Map content back to detail
      createdAt: article.createdAt,
    }));

    return NextResponse.json(mappedNews);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    // Get first branch as default
    const defaultBranch = await prisma.branch.findFirst();
    if (!defaultBranch) {
      return NextResponse.json(
        { error: "No branch available" },
        { status: 500 }
      );
    }

    const news = await prisma.newsArticle.create({
      data: {
        title: body.title.trim(),
        content: body.detail.trim(), // Map detail to content
        excerpt: body.desc.trim(), // Map desc to excerpt
        published: false,
        branchId: defaultBranch.id, // Required field
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("News creation error:", error);
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

    // Get first branch as default
    const defaultBranch = await prisma.branch.findFirst();
    if (!defaultBranch) {
      return NextResponse.json(
        { error: "No branch available" },
        { status: 500 }
      );
    }

    await prisma.newsArticle.deleteMany();

    const createdNews = await prisma.newsArticle.createMany({
      data: updates.map((news) => ({
        title: news.title,
        content: news.detail, // Map detail to content
        excerpt: news.desc, // Map desc to excerpt
        published: false,
        branchId: defaultBranch.id, // Required field
      })),
    });

    return NextResponse.json({
      message: "News replaced",
      count: createdNews.count,
    });
  } catch (error) {
    console.error("News update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
