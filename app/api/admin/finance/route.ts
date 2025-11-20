// /app/api/admin/finance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchSlug = searchParams.get("branch");
    const period = searchParams.get("period") || "month";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Build where clause
    let whereClause: any = {
      status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
    };

    if (branchSlug && branchSlug !== "all") {
      const branch = await prisma.branch.findUnique({
        where: { slug: branchSlug },
      });
      if (branch) {
        whereClause.branchId = branch.id;
      }
    }

    // Get financial data
    const [totalRevenue, monthlyRevenue, pendingPayments, bookings, branches] =
      await Promise.all([
        // Total revenue
        prisma.booking.aggregate({
          where: whereClause,
          _sum: { totalAmount: true },
        }),

        // Monthly revenue
        prisma.booking.aggregate({
          where: {
            ...whereClause,
            createdAt: { gte: startDate },
          },
          _sum: { totalAmount: true },
        }),

        // Pending payments
        prisma.booking.aggregate({
          where: { ...whereClause, status: "PENDING" },
          _sum: { totalAmount: true },
        }),

        // Bookings for average calculation
        prisma.booking.findMany({
          where: { ...whereClause, createdAt: { gte: startDate } },
          select: { totalAmount: true },
        }),

        // Branches for revenue breakdown
        prisma.branch.findMany({
          where: { published: true },
          select: { id: true, branchName: true },
        }),
      ]);

    // Calculate average booking value
    const averageBookingValue =
      bookings.length > 0
        ? bookings.reduce((sum, booking) => sum + booking.totalAmount, 0) /
          bookings.length
        : 0;

    // Get revenue by branch
    const revenueByBranch = await Promise.all(
      branches.map(async (branch) => {
        const revenue = await prisma.booking.aggregate({
          where: {
            ...whereClause,
            branchId: branch.id,
            createdAt: { gte: startDate },
          },
          _sum: { totalAmount: true },
        });
        return {
          branchName: branch.branchName,
          revenue: revenue._sum.totalAmount || 0,
        };
      })
    );

    // Recent transactions
    const recentTransactions = await prisma.booking.findMany({
      where: whereClause,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        branch: { select: { branchName: true } },
      },
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      pendingPayments: pendingPayments._sum.totalAmount || 0,
      averageBookingValue: Math.round(averageBookingValue),
      revenueByBranch,
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        guestName: t.guestName,
        amount: t.totalAmount,
        status: t.status,
        date: t.createdAt.toISOString(),
        branch: t.branch.branchName,
      })),
    });
  } catch (error) {
    console.error("Finance data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch finance data" },
      { status: 500 }
    );
  }
}
