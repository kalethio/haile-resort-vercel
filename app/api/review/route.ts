// app/api/review/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

import fs from "fs/promises";
import path from "path";
import { ReviewType } from "../../data/review";

const filePath = path.join(process.cwd(), "app", "data", "review.json");
const dirPath = path.dirname(filePath);

async function ensureFileExists() {
  try {
    await fs.access(filePath);
  } catch {
    // create dir if missing and an initial empty array file
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
    // backup corrupted file and reset to an empty array to recover
    const backup = `${filePath}.corrupt.${Date.now()}`;
    await fs.writeFile(backup, raw, "utf8").catch(() => {}); // best effort
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

// GET → return all reviews
export async function GET() {
  try {
    const reviews = await readReviews();
    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error("Error reading reviews:", err);
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

// POST → add a new review (unapproved by default)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.name || !body.text) {
      return NextResponse.json(
        { error: "Missing name or text" },
        { status: 400 }
      );
    }

    const reviews = await readReviews();
    const newReview: ReviewType = {
      id: reviews.length ? reviews[reviews.length - 1].id + 1 : 1,
      name: String(body.name).slice(0, 100),
      text: String(body.text).slice(0, 1000),
      approved: false,
    };

    reviews.push(newReview);
    await writeReviews(reviews);

    return NextResponse.json(
      { message: "Review submitted", id: newReview.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving review:", err);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }
}
