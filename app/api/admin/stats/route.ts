// /app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { branch: true },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build where clause based on permissions
    let whereClause: any = {};
    if (adminUser.role !== "SUPER_ADMIN" && adminUser.branchId) {
      whereClause.branchId = adminUser.branchId;
    }

    // Get current date range for occupancy calculation
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Parallel database queries for performance
    const [
      totalBookings,
      monthlyBookings,
      totalRevenue,
      monthlyRevenue,
      totalGuests,
      roomCount,
      occupiedRooms,
      branchStats,
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count({ where: whereClause }),

      // Monthly bookings
      prisma.booking.count({
        where: {
          ...whereClause,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),

      // Total revenue
      prisma.booking.aggregate({
        where: {
          ...whereClause,
          status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
        },
        _sum: { totalAmount: true },
      }),

      // Monthly revenue
      prisma.booking.aggregate({
        where: {
          ...whereClause,
          status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { totalAmount: true },
      }),

      // Total guests
      prisma.guest.count({
        where:
          adminUser.role !== "SUPER_ADMIN" && adminUser.branchId
            ? { branchId: adminUser.branchId }
            : {},
      }),

      // Total rooms
      prisma.room.count({
        where: whereClause,
      }),

      // Currently occupied rooms
      prisma.room.count({
        where: {
          ...whereClause,
          status: "OCCUPIED",
        },
      }),

      // Branch-specific stats for super admins
      adminUser.role === "SUPER_ADMIN"
        ? prisma.branch.findMany({
            where: { published: true },
            select: {
              branchName: true,
              slug: true,
              _count: {
                select: {
                  bookings: {
                    where: {
                      createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                      },
                    },
                  },
                  rooms: true,
                },
              },
            },
          })
        : [],
    ]);

    const occupancyRate = roomCount > 0 ? (occupiedRooms / roomCount) * 100 : 0;

    return NextResponse.json({
      overview: {
        totalBookings,
        monthlyBookings,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
        totalGuests,
        roomCount,
        occupiedRooms,
        occupancyRate: Math.round(occupancyRate),
      },
      branchStats: branchStats.map((branch) => ({
        branchName: branch.branchName,
        slug: branch.slug,
        monthlyBookings: branch._count.bookings,
        roomCount: branch._count.rooms,
      })),
      userRole: adminUser.role,
      accessibleBranches:
        adminUser.role === "SUPER_ADMIN" ? "all" : adminUser.branch?.branchName,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
