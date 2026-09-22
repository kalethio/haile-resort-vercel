// app/api/admin/career/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendApplicationAccepted,
  sendApplicationRejected,
} from "@/lib/email-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, interview } = body as {
      status: string;
      interview?: {
        date: string;
        time: string;
        location: string;
      };
    };

    // Fetch current application with job info before update
    const existing = await prisma.jobApplication.findUnique({
      where: { id: parseInt(params.id) },
      include: { job: { select: { title: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const previousStatus = existing.status;

    const application = await prisma.jobApplication.update({
      where: { id: parseInt(params.id) },
      data: { status: status as any },
    });

    // Only send email if the status actually changed
    const statusChanged = previousStatus !== status;

    if (statusChanged) {
      if (status === "ACCEPTED") {
        if (!interview?.date || !interview?.time || !interview?.location) {
          // Status updated but no email sent – interview details missing
          return NextResponse.json({
            ...application,
            warning:
              "Status updated but interview details missing; email not sent.",
          });
        }

        await sendApplicationAccepted({
          toEmail: existing.email,
          applicantName: existing.fullName,
          jobTitle: existing.job.title,
          interviewDate: interview.date,
          interviewTime: interview.time,
          interviewLocation: interview.location,
        });
      } else if (status === "REJECTED") {
        await sendApplicationRejected({
          toEmail: existing.email,
          applicantName: existing.fullName,
          jobTitle: existing.job.title,
        });
      }
    }

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
