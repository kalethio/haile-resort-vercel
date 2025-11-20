// app/api/subscribers/[id]/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Subscriber } from "@/app/data/subscriber";

const filePath = path.join(process.cwd(), "app", "data", "usersProfile.json");

async function readAll(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
async function writeAll(items: Subscriber[]) {
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const list = await readAll();
    const filtered = list.filter((s) => s.id !== id);
    await writeAll(filtered);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/subscribers/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
