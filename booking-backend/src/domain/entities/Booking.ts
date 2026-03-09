import { BookingStatus } from "../../shared/booking-status";

export interface Booking {
  id: number;
  provider_id: number;
  client_id: number;
  booking_date: string;
  status: BookingStatus;
  version: number;
}