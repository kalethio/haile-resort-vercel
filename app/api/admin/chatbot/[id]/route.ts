// app/api/admin/chatbot/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Add Promise here
) {
  try {
    const { id } = await params; // Await the params
    const data = await request.json();

    const item = await prisma.chatbotResponse.update({
      where: { id: parseInt(id) }, // Use the awaited id
      data: {
        response: data.response,
        triggers: data.triggers,
        role: data.role,
        type: data.type,
        active: data.active,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update chatbot item:", error);
    return NextResponse.json(
      { error: "Failed to update chatbot item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Add Promise here
) {
  try {
    const { id } = await params; // Await the params

    await prisma.chatbotResponse.delete({
      where: { id: parseInt(id) }, // Use the awaited id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete chatbot item:", error);
    return NextResponse.json(
      { error: "Failed to delete chatbot item" },
      { status: 500 }
    );
  }
}
