// app/booking/types/booking.ts

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
}

export interface BookingParams {
  branch: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number; // ✅ ADD THIS
  children: number; // ✅ ADD THIS
}

export type PaymentMethod = "chapa" | "stripe" | null;
export type BookingStep = 1 | 2 | 3 | 4;
