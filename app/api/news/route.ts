import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/data/latestNews.json");

// GET → return news
export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

// PUT → update news
export async function PUT(req: Request) {
  const body = await req.json(); // expects array of news
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  return NextResponse.json({ message: "News updated" });
}
