// app/api/admin/api-connections/[id]/route.ts - COMPLETE FILE
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
interface RouteParams {
  params: {
    id: string;
  };
}
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    const connection = await prisma.apiConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(connection);
  } catch (error) {
    console.error("API connection fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connection" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    console.log("🔍 DEBUG: Updating connection", id, "with:", body);

    // If activating a payment provider, deactivate all others first
    if (body.status === "active") {
      await prisma.apiConnection.updateMany({
        where: {
          type: "payment",
          status: "active",
          id: { not: id },
        },
        data: { status: "inactive" },
      });
    }

    const connection = await prisma.apiConnection.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("❌ API connection update error:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
      { status: 500 }
    );
  }
}

// In the DELETE function - UPDATE:
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams // Use the typed params
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid connection ID" },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await prisma.apiConnection.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    await prisma.apiConnection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API connection delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete connection" },
      { status: 500 }
    );
  }
}
