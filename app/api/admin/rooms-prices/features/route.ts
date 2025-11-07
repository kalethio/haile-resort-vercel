// app/api/admin/inventory/features/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId");

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID required" },
        { status: 400 }
      );
    }

    const features = await prisma.roomFeature.findMany({
      where: {
        branchId: parseInt(branchId),
        available: true,
      },
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error("Features fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}
