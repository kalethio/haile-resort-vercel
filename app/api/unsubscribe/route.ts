// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { verifySignedToken } from "@/app/admin/lib/token";
import { promises as fs } from "fs";
import path from "path";

const subsPath = path.join(process.cwd(), "app", "data", "usersProfile.json");

async function readAll() {
  try {
    const raw = await fs.readFile(subsPath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}
async function writeAll(arr: any[]) {
  await fs.writeFile(subsPath, JSON.stringify(arr, null, 2), "utf-8");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const payload = verifySignedToken(token);
    if (!payload || !payload.email)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );

    const list = await readAll();
    const filtered = list.filter(
      (s: any) =>
        String(s.email).toLowerCase() !== String(payload.email).toLowerCase()
    );
    await writeAll(filtered);

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/unsubscribe/success`;
    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("GET /api/unsubscribe error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
