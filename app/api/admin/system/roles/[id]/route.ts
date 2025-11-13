// app/api/admin/system/roles/[id]/route.ts (if it exists)
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single role with permissions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: {
        permissions: true,
        users: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}

// UPDATE role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, permissions } = body;

    // Get old role data for audit
    const oldRole = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: { permissions: true },
    });

    // Handle both old and new permission formats (same as CREATE)
    const permissionData = permissions.map((perm: any) => {
      if (typeof perm === "string") {
        // New format: just module name - use "full_access" as action
        return {
          module: perm,
          action: "full_access",
        };
      } else {
        // Old format: { module, action }
        return {
          module: perm.module,
          action: perm.action,
        };
      }
    });

    // Update role and permissions
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        permissions: {
          deleteMany: {}, // Remove existing permissions
          create: permissionData,
        },
      },
      include: {
        permissions: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ROLE_UPDATED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "Role",
        targetId: role.id,
        oldValues: oldRole,
        newValues: role,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
// DELETE role
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Add Promise
) {
  try {
    const { id } = await params; // Await the params
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: { permissions: true },
    });

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    if (role.isSystem) {
      return NextResponse.json(
        { error: "System roles cannot be deleted" },
        { status: 400 }
      );
    }

    // Check if role has users
    const userCount = await prisma.user.count({
      where: { roleId: parseInt(id) },
    });

    if (userCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete role that has users assigned" },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id: parseInt(id) },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "ROLE_DELETED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "Role",
        targetId: parseInt(id),
        oldValues: role,
      },
    });

    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
