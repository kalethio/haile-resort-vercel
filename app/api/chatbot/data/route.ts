import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.chatbotResponse.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    });

    // Format for public consumption
    const botResponses = items.map((item) => ({
      id: item.id,
      triggers: item.triggers,
      response: item.response,
      role: item.role,
      quickReplyLabel: item.quickReplyLabel,
      active: item.active,
    }));

    return NextResponse.json({ botResponses });
  } catch (error) {
    console.error("Failed to fetch chatbot data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot data" },
      { status: 500 }
    );
  }
}
