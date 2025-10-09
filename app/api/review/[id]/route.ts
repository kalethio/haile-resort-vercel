// app/api/review/[id]/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

import fs from "fs/promises";
import path from "path";
import { ReviewType } from "../../../data/review";

const filePath = path.join(process.cwd(), "app", "data", "review.json");
const dirPath = path.dirname(filePath);

async function ensureFileExists() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true }).catch(() => {});
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readReviews(): Promise<ReviewType[]> {
  await ensureFileExists();
  const raw = await fs.readFile(filePath, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("reviews root is not an array");
    return parsed as ReviewType[];
  } catch (err) {
    const backup = `${filePath}.corrupt.${Date.now()}`;
    await fs.writeFile(backup, raw, "utf8").catch(() => {});
    console.error(`review.json parse error — backing up to ${backup}`, err);
    await fs.writeFile(filePath, "[]", "utf8");
    return [];
  }
}

async function writeReviews(reviews: ReviewType[]) {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(reviews, null, 2), "utf8");
  await fs.rename(tempPath, filePath);
}

interface RequestBody {
  action?: "approve" | "delete";
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body: RequestBody = await req.json().catch(() => ({}));
    const reviews = await readReviews();
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx === -1)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.action === "approve") {
      reviews[idx].approved = true;
      await writeReviews(reviews);
      return NextResponse.json({ message: "Approved" }, { status: 200 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Failed to patch review:", err);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const reviews = await readReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    await writeReviews(filtered);
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to delete review:", err);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
