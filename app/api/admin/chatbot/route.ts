import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.chatbotResponse.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch chatbot items:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const item = await prisma.chatbotResponse.create({
      data: {
        response: data.response,
        triggers: data.triggers || [],
        role: data.role,
        active: data.active !== false,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to create chatbot item:", error);
    return NextResponse.json(
      { error: "Failed to create chatbot item" },
      { status: 500 }
    );
  }
}
