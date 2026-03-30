// /lib/email-service.ts
import {
  Booking,
  Guest,
  Branch,
  RoomType,
  Location,
  Contact,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

interface BookingConfirmationData {
  booking: Booking & {
    branch: Branch & {
      location?: Location | null;
      contact?: Contact | null;
    };
    roomBookings: {
      room: {
        roomType: RoomType;
        roomNumber: string;
      };
      pricePerNight: number;
      totalNights: number;
    }[];
  };
  guest: Guest;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  try {
    const template = await findOrCreateBookingTemplate();

    // We fetch the full branch details to get Location and Contact info
    const fullBranch = await prisma.branch.findUnique({
      where: { id: data.booking.branchId },
      include: { location: true, contact: true },
    });

    const emailContent = generateBookingEmail(template.content, {
      ...data,
      branchDetails: fullBranch,
    });
    const emailSubject = generateBookingEmail(template.subject, {
      ...data,
      branchDetails: fullBranch,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${fullBranch?.branchName || "Haile Resorts"}" <${process.env.SMTP_USER}>`,
      to: data.guest.email,
      subject: emailSubject,
      html: emailContent,
    });

    return true;
  } catch (error) {
    console.error("❌ Email failed:", error);
    return false;
  }
}

function generateBookingEmail(template: string, data: any): string {
  const { booking, guest, branchDetails } = data;
  const room = booking.roomBookings[0];

  const variables = {
    "{{guest_name}}": `${guest.firstName} ${guest.lastName}`,
    "{{company}}": guest.company || "N/A",
    "{{booking_id}}": booking.id.slice(0, 8).toUpperCase(),
    "{{check_in}}": new Date(booking.checkIn).toLocaleDateString("en-GB"),
    "{{check_out}}": new Date(booking.checkOut).toLocaleDateString("en-GB"),
    "{{room_type}}": room?.room.roomType.name || "Standard Room",
    "{{nights}}": room?.totalNights.toString() || "1",
    "{{total_amount}}": `${booking.totalAmount} ${booking.currency}`,
    "{{branch_name}}": branchDetails?.branchName || "Haile Resorts",
    "{{branch_city}}": branchDetails?.location?.city || "Ethiopia",
    "{{branch_address}}":
      branchDetails?.contact?.address || "Haile Resorts Square",
    "{{branch_phone}}":
      branchDetails?.phone ||
      branchDetails?.contact?.phone ||
      "+251 116 67 0000",
    "{{branch_email}}":
      branchDetails?.email ||
      branchDetails?.contact?.email ||
      "reservation@haileresorts.com",
  };

  let content = template;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(key, "g"), value);
  });
  return content;
}

async function findOrCreateBookingTemplate() {
  const haileHtmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #333; border: 1px solid #eee; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #8b0000; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #8b0000; letter-spacing: 4px; text-transform: uppercase;">HAILE</h1>
        <p style="margin: 0; font-weight: bold; font-size: 14px; text-transform: uppercase;">{{branch_name}}</p>
      </div>

      <p>Dear {{guest_name}},</p>
      <p>Thank you for choosing <strong>{{branch_name}}</strong>. It is our pleasure to confirm your reservation as follows:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #8b0000; color: #fff;">
          <th colspan="2" style="padding: 10px; text-align: left;">Reservation Details</th>
          <th colspan="2" style="padding: 10px; text-align: left;">Stay Summary</th>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Guest Name</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{guest_name}}</td>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Booking No.</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{booking_id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Company</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{company}}</td>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Nights</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{nights}}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Room Type</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{room_type}}</td>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Status</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: green; font-weight: bold;">: Confirmed</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Check-in</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{check_in}}</td>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Check-out</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">: {{check_out}}</td>
        </tr>
      </table>

      <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; margin-top: 10px;">
        <p style="margin: 0;"><strong>Total Amount:</strong> {{total_amount}}</p>
      </div>

      <h4 style="border-bottom: 1px solid #8b0000; padding-bottom: 5px;">Remarks</h4>
      <ul style="font-size: 12px; color: #555;">
        <li>Complementary services: Breakfast, Gym, Pool, Steam & Sauna, and Airport shuttle.</li>
        <li>Check-in: 14:00Hrs | Check-out: 12:00PM.</li>
        <li>Cancellations must be made 24Hrs before arrival to avoid a one-night No Show charge.</li>
      </ul>

      <div style="margin-top: 40px; font-size: 11px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
        <p><strong>{{branch_name}}</strong><br>
        {{branch_address}}, {{branch_city}}<br>
        Tel: {{branch_phone}} | Email: {{branch_email}}</p>
      </div>
    </div>
  `;

  let template = await prisma.emailTemplate.findFirst({
    where: { name: "Booking Confirmation" },
  });
  if (!template) {
    template = await prisma.emailTemplate.create({
      data: {
        name: "Booking Confirmation",
        subject: "Reservation Confirmation - {{booking_id}}",
        content: haileHtmlTemplate,
      },
    });
  }
  return template;
}
