import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { PaymentInstructionsEmail } from "@/app/email/PaymentInstructions";

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  fromEmail?: string;
  fromName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      guestEmail,
      guestName,
      bookingId,
      checkIn,
      checkOut,
      roomType,
      totalAmount,
      branchName,
    } = await request.json();

    // Get active email connection
    const emailConnection = await prisma.apiConnection.findFirst({
      where: {
        type: "email",
        status: "active",
      },
    });

    if (!emailConnection || !emailConnection.config) {
      return NextResponse.json(
        { error: "No active email service configured" },
        { status: 400 }
      );
    }

    // Get active payment connection (bank transfer)
    const paymentConnection = await prisma.apiConnection.findFirst({
      where: {
        type: "payment",
        status: "active",
      },
    });

    if (!paymentConnection || !paymentConnection.config) {
      return NextResponse.json(
        { error: "No active payment provider configured" },
        { status: 400 }
      );
    }

    const emailConfig = emailConnection.config as EmailConfig;
    const paymentConfig = paymentConnection.config as any;

    // Validate email config
    if (!emailConfig.fromEmail || !emailConfig.fromName) {
      return NextResponse.json(
        { error: "Email configuration incomplete" },
        { status: 400 }
      );
    }

    // Create email transporter
    let transporter;
    if (emailConfig.host) {
      transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port || 587,
        secure: emailConfig.secure || false,
        auth: {
          user: emailConfig.username,
          pass: emailConfig.password,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Only SMTP email supported currently" },
        { status: 501 }
      );
    }

    // Verify email connection
    await transporter.verify();

    // Generate email content
    const emailHtml = PaymentInstructionsEmail({
      guestName,
      bookingId,
      checkIn,
      checkOut,
      roomType,
      totalAmount,
      branchName,
      bankDetails: {
        bankName: paymentConfig.bankName,
        accountNumber: paymentConfig.accountNumber,
        accountName: paymentConfig.accountName,
        swiftCode: paymentConfig.swiftCode,
        branch: paymentConfig.branch,
        contactPhone: paymentConfig.contactPhone || "+251 11 123 4567",
        contactEmail: paymentConfig.contactEmail || "bookings@haileresorts.com",
      },
      instructions: paymentConfig.instructions || [],
    });

    // Send email
    const mailOptions = {
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      to: guestEmail,
      subject: `Payment Instructions for Booking ${bookingId} - Haile Resorts`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    // Update booking status or log the email sent
    // This would be added when we integrate with booking system

    return NextResponse.json({
      success: true,
      message: "Payment instructions sent successfully",
    });
  } catch (error) {
    console.error("Payment instructions email error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to send payment instructions. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
