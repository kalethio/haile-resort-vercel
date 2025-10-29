// app/api/admin/career/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all applications with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    const applications = await prisma.jobApplication.findMany({
      where: {
        ...(jobId && { jobId: parseInt(jobId) }),
        ...(status && { status: status as any }),
      },
      include: {
        job: {
          select: { title: true, department: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    const formattedApplications = applications.map((app) => ({
      id: app.id.toString(),
      jobId: app.jobId.toString(),
      jobTitle: app.job.title,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      currentLocation: app.currentLocation,
      educationLevel: app.educationLevel,
      yearsExperience: app.yearsExperience,
      skills: app.skills ? JSON.parse(JSON.stringify(app.skills)) : [],
      languages: app.languages ? JSON.parse(JSON.stringify(app.languages)) : [],
      certifications: app.certifications
        ? JSON.parse(JSON.stringify(app.certifications))
        : [],
      availabilityDate: app.availabilityDate?.toISOString().split("T")[0],
      willingToRelocate: app.willingToRelocate,
      expectedSalary: app.expectedSalary,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      status: app.status,
      submittedAt: app.submittedAt.toISOString(),
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
