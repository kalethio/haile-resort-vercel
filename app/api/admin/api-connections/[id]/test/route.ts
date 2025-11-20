import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

interface RouteParams {
  params: {
    id: string;
  };
}

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  fromEmail?: string;
  fromName?: string;
  apiKey?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> } // Fix: await params
) {
  try {
    const { id } = await params; // Fix: await the params
    const connectionId = parseInt(id);

    // Get the email connection
    const connection = await prisma.apiConnection.findUnique({
      where: { id: connectionId, type: "email" },
    });

    if (!connection || !connection.config) {
      return NextResponse.json(
        { error: "Email connection not found or not configured" },
        { status: 404 }
      );
    }

    const config = connection.config as EmailConfig;

    // Validate required config
    if (!config.fromEmail || !config.fromName) {
      return NextResponse.json(
        {
          error: "Email configuration incomplete - missing from email or name",
        },
        { status: 400 }
      );
    }

    let transporter;

    if (config.host) {
      // SMTP configuration
      if (!config.username || !config.password) {
        return NextResponse.json(
          {
            error:
              "SMTP configuration incomplete - missing username or password",
          },
          { status: 400 }
        );
      }

      // Fix: use createTransport (not createTransporter)
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port || 587,
        secure: config.secure || false,
        auth: {
          user: config.username,
          pass: config.password,
        },
      });
    } else if (config.apiKey) {
      // SendGrid configuration
      return NextResponse.json(
        { error: "SendGrid integration coming soon" },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid email configuration - must be SMTP or SendGrid" },
        { status: 400 }
      );
    }

    // Verify connection
    await transporter.verify();

    // Send test email
    const testEmail = {
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.fromEmail, // Send to yourself for testing
      subject: "Test Email from Haile Resorts",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Haile Resorts</h1>
              <h2>Email Test Successful</h2>
            </div>
            
            <div class="content">
              <p>This is a test email from your Haile Resorts admin panel.</p>
              <p><strong>Connection:</strong> ${connection.name}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p>If you're receiving this, your email configuration is working correctly!</p>
            </div>
            
            <div class="footer">
              <p>Haile Resorts &copy; ${new Date().getFullYear()}</p>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(testEmail);

    // Update lastTest timestamp
    await prisma.apiConnection.update({
      where: { id: connectionId },
      data: { lastTest: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
    });
  } catch (error) {
    console.error("Email connection test error:", error);
    return NextResponse.json(
      { error: "Failed to send test email. Please check your configuration." },
      { status: 500 }
    );
  }
}
