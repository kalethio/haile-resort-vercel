// app/api/career/jobs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const jobs = await prisma.jobOpening.findMany({
      where: {
        published: true,
        OR: [{ deadline: null }, { deadline: { gte: now } }],
      },
      include: {
        branch: {
          select: { id: true, branchName: true, slug: true },
        },
      },
    });

    console.log("📊 Found", jobs.length, "active jobs");

    const formattedJobs = jobs.map((job) => ({
      id: job.id.toString(),
      title: job.title,
      department: job.department || "",
      branches: [job.branch.branchName],
      branchIds: [job.branch.id],
      type: job.type || "Full-time",
      location: job.location || job.branch.branchName,
      deadline: job.deadline?.toISOString().split("T")[0],
      description: job.description || "",
      responsibilities: [],
      requirements: [],
      applicants: 0,
      published: job.published,
    }));

    return NextResponse.json(formattedJobs, {
      headers: { "x-data-source": "database" },
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    return NextResponse.json({ error: "No jobs available" }, { status: 500 });
  }
}
