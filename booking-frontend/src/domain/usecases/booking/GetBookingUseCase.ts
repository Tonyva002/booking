import type { Booking } from "../../entities/Booking";
import type { BookingRepository } from "../../repositories/BookingRepository";

export class GetBookingsUseCase {

  constructor(private bookingRepo: BookingRepository) {}

  execute(): Promise<Booking[]> {
    return this.bookingRepo.getBookings();
  }

}