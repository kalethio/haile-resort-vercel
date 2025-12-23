// app/booking/components/ConfirmationStep.tsx - FIXED
"use client";
import React, { useState, useEffect } from "react";
import { Mail, Download } from "lucide-react";

interface ConfirmationStepProps {
  bookingId: string | null;
  customerEmail?: string; // ADD THIS
  onReset: () => void;
  onDone: () => void;
}

export default function ConfirmationStep({
  bookingId,
  customerEmail, // USE THIS
  onReset,
  onDone,
}: ConfirmationStepProps) {
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");

  // Send email on mount IF customerEmail exists
  useEffect(() => {
    if (customerEmail) {
      sendConfirmationEmail();
    }
  }, [customerEmail]);

  const sendConfirmationEmail = async () => {
    if (!customerEmail) return;

    setEmailStatus("sending");
    try {
      const response = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Booking Confirmation #${bookingId}`,
          html: generateEmailContent(),
          targetIds: [customerEmail], // USE ACTUAL EMAIL
        }),
      });

      if (response.ok) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("failed");
      }
    } catch (error) {
      setEmailStatus("failed");
    }
  };

  const generateEmailContent = () => {
    return `<p>Booking ${bookingId} confirmed. Details attached.</p>`;
  };

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download receipt");
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Booking ${bookingId} - Haile Resort</title>
        <style>
          @media print {
            @page { margin: 20mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body {
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #780b2d;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #780b2d;
            margin-bottom: 10px;
          }
          .booking-id {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 18px;
            text-align: center;
          }
          .info-section {
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HAILE RESORT</div>
          <h1>Booking Confirmation</h1>
          <p>Thank you for your reservation</p>
        </div>

        <div class="booking-id">Booking Reference: ${bookingId}</div>

        <div class="info-section">
          <h3>Important Information</h3>
          <p>• Present this confirmation at check-in</p>
          <p>• Check-in time: 3:00 PM</p>
          <p>• Check-out time: 11:00 AM</p>
        </div>

        <div class="footer">
          <p>For questions, contact: reservations@haileresort.com</p>
          <p>Document generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Success Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for choosing Haile Resorts
          </p>
          {bookingId && (
            <p className="text-sm text-gray-500">
              Reference:{" "}
              <span className="font-mono text-primary">{bookingId}</span>
            </p>
          )}
        </div>

        {/* Email Status */}
        <div className="mb-8 p-4 border rounded-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-primary/50" />
            <span className="font-medium text-primary/50">
              Confirmation Email
            </span>
          </div>
          {!customerEmail ? (
            <p className="text-yellow-600 text-sm">
              No email provided for confirmation
            </p>
          ) : emailStatus === "sending" ? (
            <p className="text-blue-600 text-sm">
              Sending to {customerEmail}...
            </p>
          ) : emailStatus === "sent" ? (
            <p className="text-green-600 text-sm">
              ✓ Email sent to {customerEmail}
            </p>
          ) : emailStatus === "failed" ? (
            <div className="text-red-600 text-sm">
              <p>Failed to send email</p>
              <button
                onClick={sendConfirmationEmail}
                className="mt-2 text-sm underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          ) : null}
        </div>

        {/* PDF Download */}
        <div className="mb-8">
          <button
            onClick={generatePDF}
            className="inline-flex text-primary items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download PDF Receipt
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Book Another Stay
          </button>
          <button
            onClick={onDone}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
