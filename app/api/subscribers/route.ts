// app/api/subscribers/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Subscriber } from "@/app/data/subscriber";

const filePath = path.join(process.cwd(), "app", "data", "usersProfile.json");

async function readAll(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

async function writeAll(items: Subscriber[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  const list = await readAll();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;
    if (!email)
      return NextResponse.json({ error: "Email required" }, { status: 400 });

    const list = await readAll();
    const lc = String(email).toLowerCase();
    const exists = list.find((s) => s.email.toLowerCase() === lc);
    if (exists) {
      return NextResponse.json(
        { message: "Already subscribed" },
        { status: 200 }
      );
    }

    const newSub: Subscriber = {
      id: String(Date.now()),
      email: lc,
      name: name ? String(name) : undefined,
      createdAt: new Date().toISOString(),
    };

    list.push(newSub);
    await writeAll(list);

    return NextResponse.json(
      { message: "Subscribed", subscriber: newSub },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/subscribers error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
