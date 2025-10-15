// app/api/branches/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const branches = await prisma.branch.findMany({
    select: { slug: true, branchName: true },
  });
  return NextResponse.json(branches);
}
