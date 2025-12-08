// app/admin/reservations/components/BookingCard.tsx
import React, { useState } from "react";
import {
  Calendar,
  Building,
  Users,
  DollarSign,
  Mail,
  Loader,
  CheckCircle,
  XCircle,
  Phone,
  Printer,
} from "lucide-react";
import { Booking } from "./types";

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: string) => Promise<void>;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
  isLoading?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusChange,
  onRefresh,
  isLoading = false,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [updateError, setUpdateError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      CHECKED_IN: "bg-green-100 text-green-800",
      CHECKED_OUT: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const workflow: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["CHECKED_IN", "CANCELLED", "PENDING"],
      CHECKED_IN: ["CHECKED_OUT", "CONFIRMED"],
      CHECKED_OUT: ["CHECKED_IN"],
      CANCELLED: ["PENDING"],
    };
    return workflow[currentStatus] || [];
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await onStatusChange(booking.id, newStatus);
      setShowConfirmation(false);
    } catch (error) {
      setUpdateError("Failed to update status");
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // SIMPLE PRINT FUNCTION
  const printBooking = () => {
    // Create a print-friendly window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print booking details");
      return;
    }

    const statusColor = getStatusColor(booking.status);
    const bgColor = statusColor.split(" ")[0].replace("bg-", "");
    const textColor = statusColor.split(" ")[1].replace("text-", "");

    printWindow.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Booking ${booking.id} - Haile Hotel and Resorts</title>
      <style>
        @media print {
          @page { margin: 18mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.2;
          padding: 15px;
          max-width: 750px;
          margin: 0 auto;
          font-size: 14px;
        }
        .header {
          border-bottom: 2px solid #780b2d;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .resort-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .logo-box {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #780b1a, #780b2d);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }
        .resort-name { font-size: 14px; font-weight: 600; color: #780b2d; }
        .subtitle { color: #6b7280; margin-top: 1px; font-size: 12px; }
        .booking-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 16px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 10px;
          background-color: var(--status-bg, #f3f4f6);
          color: var(--status-text, #374151);
        }
        .grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-card {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #780b2d;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; background-color: #3b82f6; }
        .dot-green { background-color: #10b981; }
        .dot-yellow { background-color: #f59e0b; }
        .info-row { margin-bottom: 6px; }
        .info-row strong { display: inline-block; width: 110px; color: #4b5563; }
        .total-card {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          padding: 20px;
          border-radius: 8px;
          color: white;
          margin-bottom: 20px;
        }
        .total-amount { display: flex; justify-content: space-between; align-items: center; }
        .amount { font-size: 28px; font-weight: bold; }
        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 11px;
          text-align: center;
        }
        @media (max-width: 768px) { .grid-2col { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="resort-logo">
          <div class="logo-box">H</div>
          <div>
            <div class="resort-name">HAILE RESORT</div>
            <div class="subtitle">Booking Confirmation</div>
          </div>
        </div>
      </div>

      <div class="booking-header">
        <div>
          <h2 style="font-size: 18px; font-weight: bold; color: #111827; margin-bottom: 6px;">
            Booking Details
          </h2>
          <p style="color: #6b7280; font-size: 13px;">Booking ID: ${booking.id}</p>
          <p style="color: #6b7280; font-size: 13px;">Created: ${new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        <span class="status-badge" style="--status-bg: ${bgColor}; --status-text: ${textColor};">
          ${booking.status.replace("_", " ")}
        </span>
      </div>

      <div class="grid-2col">
        <div class="info-card">
          <div class="section-title">
            <span class="dot"></span> Guest Information
          </div>
          <div class="info-row"><strong>Name:</strong> ${booking.guestName}</div>
          <div class="info-row"><strong>Email:</strong> ${booking.guestEmail}</div>
          <div class="info-row"><strong>Phone:</strong> ${booking.guestPhone || "Not provided"}</div>
        </div>

        <div class="info-card">
          <div class="section-title">
            <span class="dot dot-green"></span> Stay Details
          </div>
          <div class="info-row"><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</div>
          <div class="info-row"><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</div>
          <div class="info-row"><strong>Nights:</strong> ${booking.roomBookings[0]?.totalNights}</div>
          <div class="info-row"><strong>Guests:</strong> ${booking.adults} adults, ${booking.children} children</div>
        </div>
      </div>

      <div class="info-card">
        <div class="section-title">
          <span class="dot dot-yellow"></span> Room Information
        </div>
        <div class="info-row"><strong>Branch:</strong> ${booking.branch.branchName}</div>
        <div class="info-row"><strong>Room:</strong> ${booking.roomBookings[0]?.room.roomNumber}</div>
        <div class="info-row"><strong>Room Type:</strong> ${booking.roomBookings[0]?.room.roomType.name}</div>
        <div class="info-row"><strong>Price per night:</strong> $${booking.roomBookings[0]?.pricePerNight}</div>
      </div>

      <div class="total-card" style="padding: 15px; border-radius: 6px;">
  <div class="total-amount">
    <div>
      <h3 style="font-size: 11px; font-weight: 600; margin-bottom: 1px;">Total Amount</h3>
      <p style="opacity: 0.9; font-size: 11px;">All taxes and fees included</p>
    </div>
    <div style="text-align: right;">
      <div class="amount" style="font-size: 24px; font-weight: 600;">$${booking.totalAmount}</div>
      <p style="opacity: 0.9; font-size: 11px;">USD</p>
    </div>
  </div>
</div>


      <div class="footer">
        <p>This is an official booking confirmation from Haile Resort.</p>
        <p style="margin-top: 4px;">For any questions, please contact ${booking.branch.branchName} branch.</p>
        <p style="margin-top: 4px;">Document printed on ${new Date().toLocaleDateString()}</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => window.close(), 1000);
        };
      </script>
    </body>
  </html>
`);

    printWindow.document.close();
  };

  const sendConfirmationEmail = async (bookingId: string) => {
    setIsSendingEmail(true);
    setEmailStatus("idle");
    try {
      const res = await fetch("/api/admin/send-transactional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, emailType: "confirmation" }),
      });

      if (res.ok) {
        setEmailStatus("success");
        setTimeout(() => setEmailStatus("idle"), 3000);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      setEmailStatus("error");
      console.error("Failed to send email:", error);
      setTimeout(() => setEmailStatus("idle"), 3000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const availableStatuses = getAvailableStatuses(booking.status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white relative">
      {/* Loading Overlay */}
      {(isUpdating || isLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg z-10">
          <Loader size={20} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">
            {booking.guestName}
          </h4>
          <p className="text-xs text-gray-500 truncate">{booking.guestEmail}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      {/* Booking Details - WITH PHONE */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            {new Date(booking.checkIn).toLocaleDateString()} -{" "}
            {new Date(booking.checkOut).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Building size={14} />
          <span>{booking.branch.branchName}</span>
        </div>

        {/* ADDED PHONE DISPLAY */}
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-500" />
          <span className={!booking.guestPhone ? "text-gray-400 italic" : ""}>
            {booking.guestPhone || "No phone provided"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={14} />
          <span>
            {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
            {booking.children > 0 &&
              `, ${booking.children} child${booking.children !== 1 ? "ren" : ""}`}
          </span>
        </div>

        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <DollarSign size={14} />
          <span>${booking.totalAmount}</span>
          <span className="text-gray-400 font-normal text-xs">
            • {booking.roomBookings[0]?.totalNights} night
            {booking.roomBookings[0]?.totalNights !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Room Info */}
      <div className="mb-4">
        <p className="text-xs text-gray-600">
          {booking.roomBookings[0]?.room.roomNumber} •{" "}
          {booking.roomBookings[0]?.room.roomType.name}
        </p>
      </div>

      {/* Actions - SIMPLIFIED WITH PRINT */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={printBooking}
          disabled={isUpdating || isLoading}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Printer size={14} /> Print
        </button>

        <button
          onClick={() => sendConfirmationEmail(booking.id)}
          disabled={isSendingEmail || isUpdating || isLoading}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 relative"
        >
          {isSendingEmail ? (
            <Loader size={14} className="animate-spin" />
          ) : emailStatus === "success" ? (
            <CheckCircle size={14} className="text-green-400" />
          ) : emailStatus === "error" ? (
            <XCircle size={14} className="text-red-400" />
          ) : (
            <Mail size={14} />
          )}
          Email
        </button>
      </div>

      {/* Error Message */}
      {updateError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {updateError}
        </div>
      )}

      {/* Status Dropdown with Confirmation */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {showConfirmation ? (
          // Confirmation Section
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 -mx-2 -mb-2">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Change to {pendingStatus.replace("_", " ")}?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(pendingStatus)}
                disabled={isUpdating}
                className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                ✓ Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setUpdateError(null);
                }}
                disabled={isUpdating}
                className="flex-1 px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ✗ Cancel
              </button>
            </div>
          </div>
        ) : (
          // Status Dropdown
          <select
            value={booking.status}
            onChange={(e) => {
              if (e.target.value !== booking.status) {
                setPendingStatus(e.target.value);
                setShowConfirmation(true);
                setUpdateError(null);
              }
            }}
            disabled={isUpdating || isLoading}
            className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-800 disabled:opacity-50 text-gray-900 bg-white"
          >
            <option value={booking.status}>
              Keep {booking.status.replace("_", " ")}
            </option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "CANCELLED"
                  ? "✗ Cancel Booking"
                  : status === "CHECKED_OUT"
                    ? "✓ Check Out"
                    : status === "CONFIRMED"
                      ? "✓ Confirm Booking"
                      : `→ ${status.replace("_", " ")}`}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
