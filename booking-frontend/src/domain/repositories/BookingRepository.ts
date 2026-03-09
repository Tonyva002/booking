import type { Booking } from "../entities/Booking";

export interface BookingRepository {

  getBookings(): Promise<Booking[]>;

  confirmBooking(id: number): Promise<void>;

  cancelBooking(id: number): Promise<void>;

  rescheduleBooking(id: number, date: string): Promise<void>;

  createBooking(providerId: number, clientId: number, date: string): Promise<Booking>;

}