// app/booking/types/booking.ts - IMPROVED

export interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
  available: boolean;
  availableRoomsCount?: number;
  totalRooms?: number;
  branchName?: string; // ✅ Added for payment section
}

export interface BookingSummary {
  nights: number;
  roomPrice: number;
  taxes: number;
  total: number;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  guestCountry: string;
}

export interface BookingParams {
  branch: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  guestInfo?: GuestInfo; // ✅ ADD THIS - FIXES THE ISSUE
}

export type PaymentMethod = "bank" | "gateway" | null; // ✅ Fixed to match your system
export type BookingStep = 1 | 2 | 3 | 4;

// ✅ ADD PAYMENT STATUS TYPES
export type PaymentStatus =
  | "pending"
  | "instructions_sent"
  | "awaiting_verification"
  | "confirmed"
  | "failed";

// ✅ ADD PAYMENT CONFIG TYPE
export interface PaymentConfig {
  active: boolean;
  provider: string;
  type: "bank" | "gateway";
  config: any;
  instructions: string[];
}
