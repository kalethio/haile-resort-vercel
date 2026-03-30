// app/booking/components/ConfirmationStep.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Mail, Download, CheckCircle2, Home, PlusCircle } from "lucide-react";

interface ConfirmationStepProps {
  bookingId: string | null;
  customerEmail?: string;
  onReset: () => void;
  onDone: () => void;
}

export default function ConfirmationStep({
  bookingId,
  customerEmail,
  onReset,
  onDone,
}: ConfirmationStepProps) {
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");

  useEffect(() => {
    if (customerEmail && bookingId) {
      sendConfirmationEmail();
    }
  }, [customerEmail, bookingId]);

  const sendConfirmationEmail = async () => {
    if (!customerEmail) return;

    setEmailStatus("sending");
    try {
      const response = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Reservation Confirmation - ${bookingId?.slice(0, 8).toUpperCase()}`,
          html: generateEmailContent(),
          targetIds: [customerEmail],
          isTransactional: true,
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
    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333; border: 1px solid #eee; padding: 25px;">
        <div style="text-align: center; border-bottom: 2px solid #8b0000; padding-bottom: 15px; margin-bottom: 25px;">
          <h1 style="margin: 0; color: #8b0000; letter-spacing: 4px; text-transform: uppercase; font-size: 28px;">HAILE</h1>
          <p style="margin: 0; font-weight: bold; font-size: 14px; text-transform: uppercase; color: #555;">Hotels & Resorts</p>
        </div>

        <p>Dear Guest,</p>
        <p>Thank you for choosing Haile Hotels and Resorts. We are delighted to confirm your reservation. It is our pleasure to provide your booking details below:</p>

        <div style="background-color: #8b0000; color: #ffffff; padding: 10px 15px; font-weight: bold; margin-top: 20px;">
          RESERVATION DETAILS
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Reference No.</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">: ${bookingId?.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Status</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; color: #16a34a; font-weight: bold;">: CONFIRMED</td>
          </tr>
        </table>

        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #8b0000;">
          <h4 style="margin: 0 0 10px 0; color: #8b0000;">Remarks & Policies</h4>
          <ul style="font-size: 12px; color: #555; margin: 0; padding-left: 18px; line-height: 1.6;">
            <li>Complementary Breakfast, Gym, Pool, Steam & Sauna, and Airport shuttle included.</li>
            <li>Check-in: 14:00 hrs | Check-out: 12:00 hrs.</li>
            <li>Subject to Late Checkout: 50% Day Use charge (12:00 PM - 18:00 hrs).</li>
            <li>Cancellations must be made 24 hrs before arrival to avoid a one-night No Show charge.</li>
          </ul>
        </div>

        <div style="margin-top: 40px; font-size: 11px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 15px;">
          <p><strong>Haile Hotels & Resorts - Ultimate Hospitality</strong></p>
          <p>This is an automated confirmation. For assistance, please contact our reservation department.</p>
        </div>
      </div>
    `;
  };

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Reservation Confirmation - ${bookingId}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.5; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #8b0000; padding-bottom: 20px; }
            .brand { color: #8b0000; font-size: 40px; font-weight: bold; letter-spacing: 6px; margin: 0; }
            .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .table th { background: #8b0000; color: white; padding: 12px; text-align: left; }
            .table td { padding: 12px; border-bottom: 1px solid #eee; }
            .remarks { font-size: 12px; background: #f4f4f4; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="brand">HAILE</h1>
            <p style="font-weight:bold; margin:0;">HOTELS & RESORTS</p>
            <h2 style="margin-top:20px; color:#555;">RESERVATION CONFIRMATION</h2>
          </div>
          <p>Dear Guest, Thank you for choosing Haile Hotels & Resorts. We look forward to welcoming you.</p>
          <table class="table">
            <thead><tr><th colspan="2">Booking Information</th></tr></thead>
            <tbody>
              <tr><td style="font-weight:bold;">Reference Number</td><td>${bookingId?.toUpperCase()}</td></tr>
              <tr><td style="font-weight:bold;">Status</td><td style="color:green; font-weight:bold;">Confirmed</td></tr>
              <tr><td style="font-weight:bold;">Issue Date</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
            </tbody>
          </table>
          <div class="remarks">
            <h4 style="margin:0; color:#8b0000;">Terms & Conditions</h4>
            <p>• Check-in time: 14:00 hrs. Check-out time: 12:00 hrs.</p>
            <p>• Presentation of valid ID/Passport is required upon check-in.</p>
            <p>• Late cancellation (under 24hrs) incurs a one-night charge.</p>
          </div>
          <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />

        <h2 className="text-4xl font-light text-gray-900 mb-2">
          Booking Confirmed
        </h2>
        <p className="text-gray-500 mb-8">
          We've sent a detailed confirmation to your inbox
        </p>

        {bookingId && (
          <div className="inline-block bg-gray-50 rounded-2xl px-8 py-4 mb-10 border border-gray-100">
            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
              Reference Number
            </span>
            <span className="text-2xl font-mono font-bold text-gray-800">
              {bookingId.slice(0, 8).toUpperCase()}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${emailStatus === "sent" ? "bg-green-50" : "bg-blue-50"}`}
            >
              <Mail
                className={`w-6 h-6 ${emailStatus === "sent" ? "text-green-600" : "text-blue-600"}`}
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                Email Status
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {emailStatus === "sending"
                  ? "Sending..."
                  : emailStatus === "sent"
                    ? "Sent successfully"
                    : "Preparing email"}
              </p>
            </div>
          </div>

          <button
            onClick={generatePDF}
            className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-4 hover:border-primary transition-all group"
          >
            <div className="p-3 rounded-full bg-red-50 group-hover:bg-primary/10 transition-colors">
              <Download className="w-6 h-6 text-red-600 group-hover:text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">PDF Receipt</p>
              <p className="text-xs text-gray-500">Download for records</p>
            </div>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-top border-gray-100">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 font-semibold transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Book Another
          </button>
          <button
            onClick={onDone}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 font-semibold transition-all shadow-lg shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
