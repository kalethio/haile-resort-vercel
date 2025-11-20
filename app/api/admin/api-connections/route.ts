// app/api/admin/api-connections/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where = type ? { type } : {};

    const connections = await prisma.apiConnection.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error("API connections fetch error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const connection = await prisma.apiConnection.create({
      data: {
        name: body.name,
        type: body.type,
        status: "inactive",
        config: body.config || {},
      },
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("API connection creation error:", error);
    return NextResponse.json(
      { error: "Failed to create connection" },
      { status: 500 }
    );
  }
}
