import { BookingConfirmationEmail } from "@/app/email/BookingConfirmation";

export async function sendBookingConfirmation(booking: any) {
  // For now, log the email - integrate with Resend/SendGrid later
  console.log("📧 Booking Confirmation Email Ready:");
  console.log("To:", booking.guestEmail);
  console.log("Subject: `Booking Confirmation - ${booking.id}`");
  console.log(
    "HTML:",
    BookingConfirmationEmail({
      guestName: booking.guestName,
      bookingId: booking.id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomBookings[0]?.room?.roomType?.name,
      totalAmount: booking.totalAmount,
      branchName: booking.branch.branchName,
    })
  );

  // TODO: Integrate with actual email service
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   body: JSON.stringify({ ... })
  // });
}
