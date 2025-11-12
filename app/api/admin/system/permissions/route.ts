// app/api/admin/system/permissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all permissions grouped by module
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ module: "asc" }, { action: "asc" }],
    });

    // Group by module for frontend - FIXED: changed variable name from 'module'
    const groupedPermissions = permissions.reduce((acc: any, permission) => {
      const moduleName = permission.module; // Changed from 'module' to 'moduleName'
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(permission);
      return acc;
    }, {});

    return NextResponse.json({
      permissions,
      groupedPermissions,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions" },
      { status: 500 }
    );
  }
}
