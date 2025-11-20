// app/api/admin/branches/[slug]/audit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { slug: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const branch = await prisma.branch.findFirst({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { targetType: "branch", targetId: branch.id },
          { branchId: branch.id },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("Audit logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
