// /app/api/admin/branches-list/route.ts - TEMPORARY FIX
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Skip auth for development
    // const session = await getServerSession();
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const branches = await prisma.branch.findMany({
      where: { published: true },
      select: {
        id: true,
        branchName: true,
        slug: true,
        published: true,
        _count: {
          select: {
            bookings: true,
            rooms: true,
            staff: true,
          },
        },
      },
      orderBy: {
        branchName: "asc",
      },
    });

    return NextResponse.json({
      branches: branches.map((branch) => ({
        id: branch.id,
        branchName: branch.branchName,
        slug: branch.slug,
        published: branch.published,
        stats: {
          bookings: branch._count.bookings,
          rooms: branch._count.rooms,
          staff: branch._count.staff,
        },
      })),
    });
  } catch (error) {
    console.error("Admin branches fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
