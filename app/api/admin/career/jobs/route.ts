// app/api/admin/staff/career/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all jobs for admin
export async function GET(request: NextRequest) {
  try {
    const jobs = await prisma.jobOpening.findMany({
      include: {
        branch: {
          select: { id: true, branchName: true, slug: true },
        },
        applications: {
          select: { id: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform for frontend
    const formattedJobs = jobs.map((job) => ({
      id: job.id.toString(),
      title: job.title,
      department: job.department,
      description: job.description,
      location: job.location,
      type: job.type,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange,
      deadline: job.deadline?.toISOString().split("T")[0],
      responsibilities: job.responsibilities
        ? JSON.parse(JSON.stringify(job.responsibilities))
        : [],
      requirements: job.requirements
        ? JSON.parse(JSON.stringify(job.requirements))
        : [],
      published: job.published,
      applicants: job.applications.length,
      branches: [job.branch.branchName], // For display
      branchIds: [job.branch.id], // For form
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      department,
      description,
      location,
      type,
      experienceLevel,
      salaryRange,
      deadline,
      responsibilities,
      requirements,
      published,
      branchIds,
    } = body;

    console.log("📝 Creating job with data:", { title, branchIds });

    // Filter out null values and use first valid branch ID
    const validBranchIds = (branchIds || []).filter(
      (id: any) => id !== null && id !== undefined
    );
    const branchId = validBranchIds.length > 0 ? validBranchIds[0] : 1;

    console.log("🔗 Using branchId:", branchId);

    // Validate branch exists
    const branchExists = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branchExists) {
      return NextResponse.json(
        { error: "Selected branch does not exist" },
        { status: 400 }
      );
    }

    const job = await prisma.jobOpening.create({
      data: {
        title,
        department,
        description,
        location,
        type,
        experienceLevel,
        salaryRange,
        deadline: deadline ? new Date(deadline) : null,
        responsibilities: responsibilities || [],
        requirements: requirements || [],
        published: published || false,
        branchId: branchId, // ✅ Use branchId directly, not branch relation
      },
    });

    console.log("✅ Job created successfully:", job.id);

    return NextResponse.json({
      success: true,
      job: {
        id: job.id.toString(),
        title: job.title,
        published: job.published,
      },
    });
  } catch (error) {
    console.error("❌ Failed to create job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
