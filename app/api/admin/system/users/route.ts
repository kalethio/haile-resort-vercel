// app/api/admin/system/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all users with roles and branches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = { name: role };
    }

    if (status) {
      where.status = status;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            slug: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.user.count({ where });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// CREATE new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, roleId, branchSlug, status } = body; // Changed to branchSlug

    // Validate and convert IDs
    const validStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
    const userStatus = validStatuses.includes(status) ? status : "ACTIVE";

    // Convert roleId to number or null
    const parsedRoleId = roleId && roleId !== "" ? parseInt(roleId) : null;

    // Find branch by slug to get branchId
    let parsedBranchId = null;
    if (branchSlug && branchSlug !== "") {
      const branch = await prisma.branch.findUnique({
        where: { slug: branchSlug },
      });
      parsedBranchId = branch?.id || null;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password
          ? `$2b$10$HASHED_${password}`
          : `$2b$10$HASHED_default123`,
        roleId: parsedRoleId,
        branchId: parsedBranchId,
        status: userStatus,
      },
      include: {
        role: true,
        branch: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "USER_CREATED",
        userId: 1, // Should be actual admin ID
        userEmail: "system@admin.com",
        targetType: "User",
        targetId: user.id,
        newValues: user,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
