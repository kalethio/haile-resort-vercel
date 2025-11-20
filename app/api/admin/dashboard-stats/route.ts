import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get date ranges for real queries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Real database queries
    const [
      weeklyRevenue,
      todayBookings,
      todayCheckIns,
      todayCheckOuts,
      branches,
      recentBookings,
    ] = await Promise.all([
      // Weekly Revenue
      prisma.booking.aggregate({
        where: {
          status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
          createdAt: { gte: startOfWeek },
        },
        _sum: { totalAmount: true },
      }),

      // Today's Bookings
      prisma.booking.count({
        where: {
          createdAt: { gte: today },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      }),

      // Today's Check-ins
      prisma.booking.count({
        where: {
          checkIn: { gte: today, lt: tomorrow },
          status: "CHECKED_IN",
        },
      }),

      // Today's Check-outs
      prisma.booking.count({
        where: {
          checkOut: { gte: today, lt: tomorrow },
          status: "CHECKED_OUT",
        },
      }),

      // Branch Performance
      prisma.branch.findMany({
        where: { published: true },
        include: {
          bookings: {
            where: {
              createdAt: { gte: startOfMonth },
              status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
            },
          },
          rooms: {
            include: {
              roomBookings: {
                where: {
                  booking: {
                    checkIn: { lte: tomorrow },
                    checkOut: { gt: today },
                  },
                },
              },
            },
          },
        },
      }),

      // Recent Bookings
      prisma.booking.findMany({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          branch: {
            select: { branchName: true },
          },
        },
      }),
    ]);

    // Calculate branch performance
    const branchPerformance = branches.map((branch) => {
      const totalRooms = branch.rooms.length;
      const occupiedRooms = branch.rooms.filter(
        (room) => room.roomBookings.length > 0
      ).length;
      const occupancy =
        totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

      const revenue = branch.bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      );

      return {
        name: branch.branchName,
        occupancy,
        revenue,
      };
    });

    // REAL monthly trends data
    const monthlyTrends = await Promise.all(
      branches.map(async (branch) => {
        const monthsData = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Get data for each month of current year
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(today.getFullYear(), i, 1);
          const monthEnd = new Date(today.getFullYear(), i + 1, 0);

          // Count occupied rooms for this month
          const occupiedRooms = await prisma.room.count({
            where: {
              branchId: branch.id,
              roomBookings: {
                some: {
                  booking: {
                    checkIn: { lte: monthEnd },
                    checkOut: { gt: monthStart },
                  },
                },
              },
            },
          });

          const totalRooms = branch.rooms.length;
          const occupancy =
            totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

          monthsData.push({
            month: monthNames[i],
            occupancy,
          });
        }

        return {
          branch: branch.branchName,
          months: monthsData,
        };
      })
    );

    return NextResponse.json({
      weeklyRevenue: weeklyRevenue._sum.totalAmount || 0,
      todayBookings,
      todayCheckIns,
      todayCheckOuts,
      branchPerformance,
      monthlyTrends,
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        guestName: booking.guestName,
        checkIn: booking.checkIn.toISOString().split("T")[0],
        checkOut: booking.checkOut.toISOString().split("T")[0],
        status: booking.status.toLowerCase(),
        amount: booking.totalAmount,
        branch: booking.branch.branchName,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
