// app/api/career/jobs/route.ts - FIXED
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.jobOpening.findMany({
      where: { published: true },
      include: {
        branch: {
          select: { id: true, branchName: true, slug: true },
        },
      },
    });

    console.log("📊 Found", jobs.length, "jobs in database");

    // Transform using ONLY fields that exist in your schema
    const formattedJobs = jobs.map((job) => ({
      id: job.id.toString(),
      title: job.title,
      department: job.department || "",
      branches: [job.branch.branchName],
      branchIds: [job.branch.id],
      type: job.type || "Full-time",
      location: job.location || job.branch.branchName,
      // REMOVED: experienceLevel - field doesn't exist
      // REMOVED: salaryRange - field doesn't exist
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
