import React, { useState } from "react";
import {
  Calendar,
  Building,
  Users,
  DollarSign,
  Mail,
  FileText,
  Loader,
} from "lucide-react";
import { Booking } from "./types";

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: string) => void;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusChange,
  onRefresh,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

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
    const workflow = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"];
    const currentIndex = workflow.indexOf(currentStatus);

    if (currentIndex === -1) return [];

    const available = workflow.slice(currentIndex);
    return [...available, "CANCELLED"];
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(booking.id, newStatus);
      setShowConfirmation(false);
      onRefresh(true); // Refresh data after status change
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadBookingDetails = (booking: Booking) => {
    const content = `
BOOKING DETAILS
===============

Guest: ${booking.guestName}
Email: ${booking.guestEmail}
Status: ${booking.status}
Check-in: ${new Date(booking.checkIn).toLocaleDateString()}
Check-out: ${new Date(booking.checkOut).toLocaleDateString()}
Branch: ${booking.branch.branchName}
Total: $${booking.totalAmount}

Room: ${booking.roomBookings[0]?.room.roomNumber}
Type: ${booking.roomBookings[0]?.room.roomType.name}
Nights: ${booking.roomBookings[0]?.totalNights}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendConfirmationEmail = async (bookingId: string) => {
    try {
      const res = await fetch("/api/admin/send-transactional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, emailType: "confirmation" }),
      });
      if (res.ok) {
        console.log("Email sent successfully");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const availableStatuses = getAvailableStatuses(booking.status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white relative">
      {/* Loading Overlay */}
      {isUpdating && (
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

      {/* Booking Details */}
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

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => downloadBookingDetails(booking)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
        >
          <FileText size={14} /> Download
        </button>
        <button
          onClick={() => sendConfirmationEmail(booking.id)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-900 transition-colors"
        >
          <Mail size={14} /> Email
        </button>
      </div>

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
                onClick={() => setShowConfirmation(false)}
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
              }
            }}
            disabled={isUpdating}
            className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-800 disabled:opacity-50 text-gray-900 bg-white"
          >
            <option value={booking.status}>
              Keep {booking.status.replace("_", " ")}
            </option>
            {availableStatuses
              .filter((status) => status !== booking.status)
              .map((status) => (
                <option key={status} value={status}>
                  {status === "CANCELLED"
                    ? "✗ Cancel Booking"
                    : status === "CHECKED_OUT"
                      ? "✓ Check Out"
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
