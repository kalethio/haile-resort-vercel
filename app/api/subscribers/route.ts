// app/api/subscribers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Subscriber } from "@/app/data/subscriber";

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });

    // Convert to your existing Subscriber type
    const formatted: Subscriber[] = subscribers.map((s) => ({
      id: String(s.id),
      email: s.email,
      name: s.name || undefined,
      createdAt: s.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/subscribers error:", err);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const lc = String(email).toLowerCase();

    // Check if exists
    const existing = await prisma.subscriber.findUnique({
      where: { email: lc },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    // Create new subscriber
    const newSub = await prisma.subscriber.create({
      data: {
        email: lc,
        name: name ? String(name) : null,
        active: true,
      },
    });

    const formatted: Subscriber = {
      id: String(newSub.id),
      email: newSub.email,
      name: newSub.name || undefined,
      createdAt: newSub.createdAt.toISOString(),
    };

    return NextResponse.json(
      { message: "Subscribed", subscriber: formatted },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/subscribers error:", err);

    // Handle unique constraint violation
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
