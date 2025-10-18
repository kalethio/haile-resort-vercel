import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const template = await prisma.emailTemplate.create({
      data: {
        name: body.name,
        subject: body.subject,
        content: body.content,
      },
    });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}
