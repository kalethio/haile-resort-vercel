import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// Create transporter with better error handling
const createTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP environment variables are missing");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465, // Fixed port for SSL
    secure: true, // REQUIRED for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};
export async function POST(req: Request) {
  try {
    const { subject, html, targetIds, isTransactional } = await req.json();

    // Validate input
    if (!subject || !html || !targetIds || !Array.isArray(targetIds)) {
      return NextResponse.json(
        { error: "Missing required fields: subject, html, targetIds" },
        { status: 400 }
      );
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { error: "No email recipients provided" },
        { status: 400 }
      );
    }

    console.log("SMTP Configuration:", {
      host: process.env.SMTP_HOST ? "Set" : "Missing",
      user: process.env.SMTP_USER ? "Set" : "Missing",
      hasPassword: !!process.env.SMTP_PASSWORD,
      port: process.env.SMTP_PORT || "587",
      recipients: targetIds.length,
    });

    const transporter = createTransporter();

    // Verify SMTP connection first
    await transporter.verify();

    console.log("SMTP connection verified successfully");

    // Send emails
    const sentEmails = [];
    const failedEmails = [];

    for (const email of targetIds) {
      try {
        await transporter.sendMail({
          from: `Haile Resorts <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html,
        });
        sentEmails.push(email);
        console.log(`✅ Email sent to: ${email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send to ${email}:`, emailError);
        failedEmails.push({ email, error: emailError.message });
      }
    }

    // Log campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        subject,
        content: html,
        targetCount: targetIds.length,
        sentCount: sentEmails.length,
        failedCount: failedEmails.length,
        status: sentEmails.length > 0 ? "PARTIAL" : "FAILED",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Emails sent: ${sentEmails.length}/${targetIds.length}`,
      campaignId: campaign.id,
      sent: sentEmails,
      failed: failedEmails.length > 0 ? failedEmails : undefined,
    });
  } catch (error) {
    console.error("SMTP Full Error:", {
      message: error.message,
      stack: error.stack,
      env: {
        SMTP_HOST: process.env.SMTP_HOST ? "Set" : "Missing",
        SMTP_USER: process.env.SMTP_USER ? "Set" : "Missing",
        hasPassword: !!process.env.SMTP_PASSWORD,
      },
    });

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message,
        suggestion: "Check SMTP configuration and credentials",
      },
      { status: 500 }
    );
  }
}
