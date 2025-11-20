// app/api/chatbot/data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🔍 Fetching chatbot data from database...");

    const [botResponses, quickReplies] = await Promise.all([
      prisma.chatbotResponse.findMany({
        where: {
          type: "RESPONSE",
          active: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.chatbotResponse.findMany({
        where: {
          type: "QUICK_REPLY",
          active: true,
        },
        orderBy: { id: "asc" },
      }),
    ]);

    console.log("📊 Bot Responses found:", botResponses.length);
    console.log("📊 Quick Replies found:", quickReplies.length);

    if (botResponses.length > 0) {
      console.log("Sample bot response:", botResponses[0]);
    }

    const result = {
      botResponses: botResponses.map((r) => ({
        triggers: (r.triggers as string[]) || [],
        response: r.response,
        role: r.role as
          | "reception"
          | "spa"
          | "restaurant"
          | "booking"
          | undefined,
      })),
      quickReplies: quickReplies.map((r) => r.response),
    };

    console.log("✅ Final data being sent:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Failed to fetch chatbot data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot data" },
      { status: 500 }
    );
  }
}
