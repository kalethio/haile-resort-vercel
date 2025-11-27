import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { subject, html, targetIds, isTransactional } = await req.json();

    // Send real emails instead of simulating
    for (const email of targetIds) {
      await transporter.sendMail({
        from: `Haile Resorts <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      });
    }

    // Log campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        subject,
        content: html,
        targetCount: targetIds.length,
        status: "SENT",
      },
    });

    return NextResponse.json({
      message: `Email sent to ${targetIds.length} recipients`,
      campaignId: campaign.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
