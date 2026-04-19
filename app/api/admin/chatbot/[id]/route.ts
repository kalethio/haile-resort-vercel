import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const item = await prisma.chatbotResponse.update({
      where: { id: parseInt(id) },
      data: {
        response: data.response,
        triggers: data.triggers,
        role: data.role,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.chatbotResponse.delete({
      where: { id: parseInt(id) },
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
