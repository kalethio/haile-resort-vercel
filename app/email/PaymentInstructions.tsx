interface PaymentInstructionsEmailProps {
  guestName: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalAmount: number;
  branchName: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode: string;
    branch: string;
    contactPhone: string;
    contactEmail: string;
  };
  instructions: string[];
}

export function PaymentInstructionsEmail({
  guestName,
  bookingId,
  checkIn,
  checkOut,
  roomType,
  totalAmount,
  branchName,
  bankDetails,
  instructions,
}: PaymentInstructionsEmailProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header { 
            background: #3B82F6; 
            color: white; 
            padding: 30px; 
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content { 
            padding: 30px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .booking-details { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-left: 4px solid #3B82F6;
          }
          .bank-details {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #bae6fd;
          }
          .instructions {
            background: #fffbeb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #fcd34d;
          }
          .footer { 
            background: #f1f5f9; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px;
            border-radius: 0 0 10px 10px;
            margin-top: 20px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-label {
            font-weight: 600;
            color: #6b7280;
          }
          .detail-value {
            font-weight: 500;
            color: #111827;
          }
          .urgent {
            color: #dc2626;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Haile Resorts</h1>
          <h2>Payment Instructions</h2>
        </div>
        
        <div class="content">
          <p>Dear ${guestName},</p>
          <p>Thank you for your booking at ${branchName}! Please complete your payment using the bank transfer details below.</p>
          
          <div class="booking-details">
            <h3 style="margin-top: 0; color: #1e40af;">Booking Summary</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span class="detail-value">${bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Resort:</span>
              <span class="detail-value">${branchName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room Type:</span>
              <span class="detail-value">${roomType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span class="detail-value">${checkIn}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span class="detail-value">${checkOut}</span>
            </div>
            <div class="detail-row" style="border-bottom: none; padding-bottom: 0;">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value" style="color: #059669; font-size: 1.1em;">USD ${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div class="bank-details">
            <h3 style="margin-top: 0; color: #0369a1;">Bank Transfer Details</h3>
            <div class="detail-row">
              <span class="detail-label">Bank Name:</span>
              <span class="detail-value">${bankDetails.bankName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Account Name:</span>
              <span class="detail-value">${bankDetails.accountName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Account Number:</span>
              <span class="detail-value" style="font-family: monospace;">${bankDetails.accountNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">SWIFT Code:</span>
              <span class="detail-value">${bankDetails.swiftCode}</span>
            </div>
            <div class="detail-row" style="border-bottom: none; padding-bottom: 0;">
              <span class="detail-label">Branch:</span>
              <span class="detail-value">${bankDetails.branch}</span>
            </div>
          </div>

          ${
            instructions.length > 0
              ? `
          <div class="instructions">
            <h3 style="margin-top: 0; color: #92400e;">Important Instructions</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${instructions.map((instruction) => `<li style="margin-bottom: 8px;">${instruction}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626; font-weight: 600;">
              ⚠️ Important: Use booking reference <strong>${bookingId}</strong> as payment description
            </p>
          </div>

          <p><strong>After Payment:</strong></p>
          <p>Once payment is completed, please email the transfer receipt to <a href="mailto:${bankDetails.contactEmail}">${bankDetails.contactEmail}</a> or call ${bankDetails.contactPhone}.</p>
          
          <p>Your booking will be confirmed within 24 hours of payment verification.</p>
        </div>
        
        <div class="footer">
          <p>Haile Resorts &copy; ${new Date().getFullYear()}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 8px;">
            This email contains sensitive payment information. Please keep it secure.
          </p>
        </div>
      </body>
    </html>
  `;
}
