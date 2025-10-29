// app/api/admin/career/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    const application = await prisma.jobApplication.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// GET - Single application with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: {
          select: { title: true, department: true, location: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const formattedApplication = {
      id: application.id.toString(),
      jobId: application.jobId.toString(),
      jobTitle: application.job.title,
      jobDepartment: application.job.department,
      jobLocation: application.job.location,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      currentLocation: application.currentLocation,
      educationLevel: application.educationLevel,
      yearsExperience: application.yearsExperience,
      skills: application.skills
        ? JSON.parse(JSON.stringify(application.skills))
        : [],
      languages: application.languages
        ? JSON.parse(JSON.stringify(application.languages))
        : [],
      certifications: application.certifications
        ? JSON.parse(JSON.stringify(application.certifications))
        : [],
      availabilityDate: application.availabilityDate
        ?.toISOString()
        .split("T")[0],
      willingToRelocate: application.willingToRelocate,
      expectedSalary: application.expectedSalary,
      coverLetter: application.coverLetter,
      resumeUrl: application.resumeUrl,
      status: application.status,
      submittedAt: application.submittedAt.toISOString(),
    };

    return NextResponse.json(formattedApplication);
  } catch (error) {
    console.error("Failed to fetch application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
