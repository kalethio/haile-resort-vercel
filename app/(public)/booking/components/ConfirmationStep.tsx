// app/booking/components/ConfirmationStep.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Mail, Download } from "lucide-react";

interface ConfirmationStepProps {
  bookingId: string | null;
  onReset: () => void;
  onDone: () => void;
}

export default function ConfirmationStep({
  bookingId,
  onReset,
  onDone,
}: ConfirmationStepProps) {
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");

  // Send email on mount
  useEffect(() => {
    sendConfirmationEmail();
  }, []);

  const sendConfirmationEmail = async () => {
    setEmailStatus("sending");
    try {
      const response = await fetch("/api/subscribers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `Booking Confirmation #${bookingId}`,
          html: generateEmailContent(),
          targetIds: ["booking-confirmation"],
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
    // Simple PDF generation for demo
    const content = `Booking Confirmation: ${bookingId}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${bookingId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
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
          {emailStatus === "sending" && (
            <p className="text-blue-600 text-sm">Sending...</p>
          )}
          {emailStatus === "sent" && (
            <p className="text-green-600 text-sm">✓ Email sent successfully</p>
          )}
          {emailStatus === "failed" && (
            <p className="text-red-600 text-sm">Failed to send email</p>
          )}
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
