import type { Booking } from "../entities/Booking";
import { BookingStatus } from "../../shared/booking-status";

export interface BookingRepository {
  countBookings(providerId: number, date: string): Promise<number>;

  create(data: Omit<Booking, "id" | "version">): Promise<number>;

  findById(id: number): Promise<Booking | null>;

  rescheduleBooking(
    id: number,
    newDate: string,
    version: number,
  ): Promise<boolean>;

  updateStatus(
    bookingId: number,
    status: BookingStatus,
    version: number,
  ): Promise<boolean>;

  findAll(): Promise<Booking[]>;
}
