// /lib/email-service.ts - FIXED
import { Booking, Guest, Branch, RoomType } from "@prisma/client";

interface BookingConfirmationData {
  booking: Booking & {
    branch: Branch;
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
    // Find or create booking confirmation template
    let template = await findOrCreateBookingTemplate();

    // Replace template variables with actual booking data
    const emailContent = generateBookingEmail(template.content, data);
    const emailSubject = generateBookingEmail(template.subject, data);

    // FIX: Use absolute URL for server-side calls
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/subscribers/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: emailSubject,
        html: emailContent,
        targetIds: [data.guest.email], // Send to guest directly
        isTransactional: true,
      }),
    });

    if (response.ok) {
      console.log(`✅ Booking confirmation sent to ${data.guest.email}`);
      return true;
    }

    const errorData = await response.json();
    console.error("Email send failed:", errorData);
    return false;
  } catch (error) {
    console.error("Failed to send booking confirmation:", error);
    return false;
  }
}
function generateBookingEmail(
  template: string,
  data: BookingConfirmationData
): string {
  const { booking, guest } = data;
  const room = booking.roomBookings[0];

  const variables = {
    "{{guest_name}}": `${guest.firstName} ${guest.lastName}`,
    "{{booking_id}}": booking.id,
    "{{check_in}}": new Date(booking.checkIn).toLocaleDateString(),
    "{{check_out}}": new Date(booking.checkOut).toLocaleDateString(),
    "{{room_type}}": room?.room.roomType.name || "N/A",
    "{{room_number}}": room?.room.roomNumber || "N/A",
    "{{nights}}": room?.totalNights.toString() || "0",
    "{{total_amount}}": `$${booking.totalAmount}`,
    "{{branch_name}}": booking.branch.branchName,
    "{{branch_phone}}": booking.branch.phone || "+251 11 123 4567",
    "{{branch_email}}": booking.branch.email || "bookings@haileresorts.com",
  };

  let content = template;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(key, "g"), value);
  });

  return content;
}

async function findOrCreateBookingTemplate(): Promise<{
  subject: string;
  content: string;
}> {
  try {
    // Try to find existing booking confirmation template
    const response = await fetch("/api/email-templates");
    const templates = await response.json();

    const bookingTemplate = templates.find(
      (t: any) =>
        t.name.toLowerCase().includes("booking") ||
        t.name.toLowerCase().includes("confirmation")
    );

    if (bookingTemplate) {
      return {
        subject: bookingTemplate.subject,
        content: bookingTemplate.content,
      };
    }

    // Create default template if none exists
    const defaultTemplate = {
      name: "Booking Confirmation",
      subject: "Booking Confirmation - {{booking_id}}",
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmed! 🎉</h2>
          
          <p>Dear {{guest_name}},</p>
          
          <p>Your booking has been confirmed. Here are your reservation details:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Reservation Details</h3>
            <p><strong>Booking ID:</strong> {{booking_id}}</p>
            <p><strong>Dates:</strong> {{check_in}} to {{check_out}} ({{nights}} nights)</p>
            <p><strong>Room:</strong> {{room_type}} - Room {{room_number}}</p>
            <p><strong>Total Amount:</strong> {{total_amount}}</p>
            <p><strong>Location:</strong> {{branch_name}}</p>
          </div>
          
          <p>We look forward to hosting you! If you have any questions, please contact us:</p>
          <p>📞 {{branch_phone}}<br>
          ✉️ {{branch_email}}</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            <a href="[unsubscribe_url]" style="color: #666;">Unsubscribe</a> from these emails
          </p>
        </div>
      `,
    };

    // Save the template
    await fetch("/api/email-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(defaultTemplate),
    });

    return {
      subject: defaultTemplate.subject,
      content: defaultTemplate.content,
    };
  } catch (error) {
    console.error("Failed to create booking template:", error);
    // Return fallback template
    return {
      subject: "Booking Confirmation - {{booking_id}}",
      content:
        "<p>Your booking has been confirmed. Booking ID: {{booking_id}}</p>",
    };
  }
}
