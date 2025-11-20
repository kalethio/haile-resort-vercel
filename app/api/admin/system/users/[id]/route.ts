// app/api/admin/system/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true,
        branch: true,
        auditLogs: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const body = await request.json();
    const { name, email, roleId, branchSlug, status } = body;

    // Validate status
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

    // Get old user data for audit
    const oldUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
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
        action: "USER_UPDATED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "User",
        targetId: user.id,
        oldValues: oldUser,
        newValues: user,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params

    // Get user data for audit before deleting
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "USER_DELETED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "User",
        targetId: parseInt(id),
        oldValues: user,
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
