interface BookingConfirmationEmailProps {
  guestName: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalAmount: number;
  branchName: string;
}

export function BookingConfirmationEmail({
  guestName,
  bookingId,
  checkIn,
  checkOut,
  roomType,
  totalAmount,
  branchName,
}: BookingConfirmationEmailProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Haile Resorts</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear ${guestName},</p>
          <p>Thank you for choosing Haile Resorts! Your booking has been received.</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Booking Reference:</strong> ${bookingId}</p>
            <p><strong>Resort:</strong> ${branchName}</p>
            <p><strong>Room:</strong> ${roomType}</p>
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <p><strong>Total Amount:</strong> $${totalAmount}</p>
          </div>
          
          <p><strong>Next Steps:</strong> Our team will contact you within 24 hours to complete payment and finalize your reservation.</p>
          
          <p>For any questions, contact us at +251 11 123 4567 or bookings@haileresorts.com</p>
        </div>
        
        <div class="footer">
          <p>Haile Resorts &copy; ${new Date().getFullYear()}</p>
        </div>
      </body>
    </html>
  `;
}
