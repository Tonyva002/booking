import type { BookingRepository } from "../../domain/repositories/BookingRepository";
import type { Booking } from "../../domain/entities/Booking";
import type { Availability } from "../../domain/entities/Availability";
import BookingApiDataSource from "../datasources/BookingApiDataSource";

export class BookingRepositoryImpl implements BookingRepository {
  constructor(private dataSource: BookingApiDataSource) {}

  getBookings(): Promise<Booking[]> {
    return this.dataSource.getBookings();
  }

  confirmBooking(id: number): Promise<void> {
    return this.dataSource.confirmBooking(id);
  }

  cancelBooking(id: number): Promise<void> {
    return this.dataSource.cancelBooking(id);
  }

  rescheduleBooking(id: number, date: string): Promise<void> {
    return this.dataSource.rescheduleBooking(id, date);
  }

  getAvailability(
    providerId: number,
    start: string,
    end: string
  ): Promise<Availability[]> {
    return this.dataSource.getAvailability(providerId, start, end);
  }

  createBooking(
    providerId: number,
    clientId: number,
    date: string
  ): Promise<Booking> {
    return this.dataSource.createBooking(providerId, clientId, date);
  }
}