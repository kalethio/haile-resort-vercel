// app/api/career/accepted/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const accepted = await prisma.jobApplication.findMany({
      where: { status: "ACCEPTED" },
      select: {
        id: true,
        fullName: true,
        job: {
          select: {
            title: true,
            branch: {
              select: { branchName: true },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formatted = accepted.map((a) => ({
      id: a.id,
      fullName: a.fullName,
      jobTitle: a.job.title,
      branchName: a.job.branch.branchName,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching accepted applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch accepted list" },
      { status: 500 }
    );
  }
}
