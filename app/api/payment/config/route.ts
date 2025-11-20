// app/api/payment/config/route.ts - ADD TIMEOUT HANDLING
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Add timeout handling
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), 8000)
  );

  try {
    console.log("🔍 Payment config API called");

    // Race between the DB query and timeout
    const activePayment = (await Promise.race([
      prisma.apiConnection.findFirst({
        where: {
          type: "payment",
          status: "active",
        },
      }),
      timeoutPromise,
    ])) as any;

    console.log("📊 Active payment found:", activePayment?.id);

    if (!activePayment) {
      const response = {
        active: false,
        message: "No payment provider configured",
      };
      return NextResponse.json(response);
    }

    const config = activePayment.config || {};

    const response = {
      active: true,
      provider: activePayment.name || "Payment Provider",
      type: config.bankName ? "bank" : "gateway",
      config: config,
      instructions: config.instructions || [],
      contactInfo: {
        phone: config.contactPhone || "+251 11 123 4567",
        email: config.contactEmail || "payments@haileresorts.com",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Payment config error:", error);

    const errorResponse = {
      active: false,
      error: error.message || "Service temporarily unavailable",
      message: "Please contact us directly to complete your booking",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
