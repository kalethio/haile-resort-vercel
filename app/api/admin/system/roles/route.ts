// app/api/admin/system/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all roles with permissions and user count
export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          select: {
            id: true,
            module: true,
            action: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// CREATE new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isSystem, permissions } = body;

    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "Role with this name already exists" },
        { status: 400 }
      );
    }

    // Create role with permissions
    const role = await prisma.role.create({
      data: {
        name,
        description,
        isSystem: isSystem || false,
        permissions: {
          create:
            permissions?.map((perm: { module: string; action: string }) => ({
              module: perm.module,
              action: perm.action,
            })) || [],
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
        action: "ROLE_CREATED",
        userId: 1,
        userEmail: "system@admin.com",
        targetType: "Role",
        targetId: role.id,
        newValues: role,
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}
