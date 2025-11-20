import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Validate required fields
    const requiredFields = ["fullName", "email", "jobId", "jobTitle"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const jobId = formData.get("jobId") as string;

    // Verify job exists and is published
    const job = await prisma.jobOpening.findFirst({
      where: {
        id: parseInt(jobId),
        published: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or no longer available" },
        { status: 404 }
      );
    }

    // Extract and process form data
    const applicationData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
      currentLocation: (formData.get("currentLocation") as string) || "",
      educationLevel: (formData.get("educationLevel") as string) || "",
      yearsExperience: formData.get("yearsExperience")
        ? parseInt(formData.get("yearsExperience") as string)
        : 0,
      skills: formData.get("skills")
        ? (formData.get("skills") as string)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      languages: formData.get("languages")
        ? (formData.get("languages") as string)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      certifications: formData.get("certifications")
        ? (formData.get("certifications") as string)
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      availabilityDate: formData.get("availabilityDate")
        ? new Date(formData.get("availabilityDate") as string)
        : null,
      willingToRelocate: formData.get("willingToRelocate") === "true",
      expectedSalary: (formData.get("expectedSalary") as string) || "",
      coverLetter: (formData.get("coverLetter") as string) || "",
    };

    // Handle file upload
    const resumeFile = formData.get("resume") as File;
    let resumeUrl = "";

    if (resumeFile && resumeFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: "Please upload PDF or DOC files only" },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size must be less than 5MB" },
          { status: 400 }
        );
      }

      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), "public", "uploads", "resumes");
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = resumeFile.name;
      const fileExtension = originalName.split(".").pop();
      const fileName = `resume_${timestamp}.${fileExtension}`;
      resumeUrl = `/uploads/resumes/${fileName}`;

      // Save file
      await writeFile(join(uploadsDir, fileName), buffer);
    }

    // Save to database using Prisma
    const savedApplication = await prisma.jobApplication.create({
      data: {
        jobId: parseInt(jobId),
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        currentLocation: applicationData.currentLocation,
        educationLevel: applicationData.educationLevel,
        yearsExperience: applicationData.yearsExperience,
        skills: applicationData.skills,
        languages: applicationData.languages,
        certifications: applicationData.certifications,
        availabilityDate: applicationData.availabilityDate,
        willingToRelocate: applicationData.willingToRelocate,
        expectedSalary: applicationData.expectedSalary,
        coverLetter: applicationData.coverLetter,
        resumeUrl: resumeUrl,
        status: "PENDING",
        submittedAt: new Date(),
      },
      include: {
        job: {
          select: {
            title: true,
            department: true,
            branch: {
              select: {
                branchName: true,
              },
            },
          },
        },
      },
    });

    console.log("Application saved to database with ID:", savedApplication.id);

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: savedApplication.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing application:", error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "You have already applied for this position" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}

// GET method to fetch applications (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const jobId = searchParams.get("jobId");
    const branchId = searchParams.get("branchId");

    const where: any = {};

    if (status) where.status = status;
    if (jobId) where.jobId = parseInt(jobId);
    if (branchId) {
      where.job = {
        branchId: parseInt(branchId),
      };
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          job: {
            select: {
              title: true,
              department: true,
              branch: {
                select: {
                  branchName: true,
                  id: true,
                },
              },
            },
          },
        },
        orderBy: { submittedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
