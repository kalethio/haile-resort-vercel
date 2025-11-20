// app/api/admin/staff/career/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Single job
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Add Promise
) {
  const { id } = await params; // ← Await params
  try {
    const job = await prisma.jobOpening.findUnique({
      where: { id: parseInt(id) }, // ← Use the awaited id
      include: {
        branch: {
          select: { id: true, branchName: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const formattedJob = {
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
      branches: [job.branch.branchName],
      branchIds: [job.branch.id],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    return NextResponse.json(formattedJob);
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT - Update entire job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    console.log("📝 Updating job:", id, { title, branchIds });

    const branchId = branchIds && branchIds.length > 0 ? branchIds[0] : 1;

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

    const job = await prisma.jobOpening.update({
      where: { id: parseInt(id) },
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
        branchId: branchId, // ✅ Use branchId directly
      },
    });

    console.log("✅ Job updated successfully:", job.id);

    return NextResponse.json({
      success: true,
      job: {
        id: job.id.toString(),
        title: job.title,
        published: job.published,
      },
    });
  } catch (error) {
    console.error("❌ Failed to update job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
// PATCH - Partial update (for publish/unpublish)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Add Promise
) {
  const { id } = await params; // ← Await params
  try {
    const body = await request.json();
    const job = await prisma.jobOpening.update({
      where: { id: parseInt(id) }, // ← Use the awaited id
      data: body,
    });

    return NextResponse.json({
      success: true,
      job: {
        id: job.id.toString(),
        title: job.title,
        published: job.published,
      },
    });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Remove job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Add Promise
) {
  const { id } = await params; // ← Await params
  try {
    await prisma.jobOpening.delete({
      where: { id: parseInt(id) }, // ← Use the awaited id
    });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
