// app/api/admin/system/api-connections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single API connection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const connection = await prisma.apiConnection.findUnique({
      where: { id: parseInt(id) },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "API connection not found" },
        { status: 404 }
      );
    }

    // Hide API key in response
    const safeConnection = {
      ...connection,
      apiKey: connection.apiKey ? "••••••••" : null,
    };

    return NextResponse.json(safeConnection);
  } catch (error) {
    console.error("Error fetching API connection:", error);
    return NextResponse.json(
      { error: "Failed to fetch API connection" },
      { status: 500 }
    );
  }
}

// UPDATE API connection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const body = await request.json();
    const { name, type, status, apiKey, config } = body;

    const oldConnection = await prisma.apiConnection.findUnique({
      where: { id: parseInt(id) },
    });

    const connection = await prisma.apiConnection.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        status,
        apiKey: apiKey || oldConnection?.apiKey, // Keep existing if not provided
        config,
        lastTest: new Date(),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "API_CONNECTION_UPDATED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "ApiConnection",
        targetId: connection.id,
        oldValues: { ...oldConnection, apiKey: "***HIDDEN***" },
        newValues: { ...connection, apiKey: "***HIDDEN***" },
      },
    });

    // Return safe version
    const safeConnection = {
      ...connection,
      apiKey: connection.apiKey ? "••••••••" : null,
    };

    return NextResponse.json(safeConnection);
  } catch (error) {
    console.error("Error updating API connection:", error);
    return NextResponse.json(
      { error: "Failed to update API connection" },
      { status: 500 }
    );
  }
}

// DELETE API connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const connection = await prisma.apiConnection.findUnique({
      where: { id: parseInt(id) },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "API connection not found" },
        { status: 404 }
      );
    }

    await prisma.apiConnection.delete({
      where: { id: parseInt(id) },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "API_CONNECTION_DELETED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "ApiConnection",
        targetId: parseInt(id),
        oldValues: { ...connection, apiKey: "***HIDDEN***" },
      },
    });

    return NextResponse.json({
      message: "API connection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting API connection:", error);
    return NextResponse.json(
      { error: "Failed to delete API connection" },
      { status: 500 }
    );
  }
}
