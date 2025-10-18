import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { subject, html, targetIds } = await req.json();

    // Simulate sending - store campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        subject,
        content: html,
        targetCount: targetIds.length,
        status: "SIMULATED",
      },
    });

    return NextResponse.json({
      message: `[SIMULATED] Email ready for ${targetIds.length} subscribers`,
      campaignId: campaign.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    );
  }
}
