import type { BookingRepository } from "../../repositories/BookingRepository";

export class ConfirmBookingUseCase {

  constructor(private bookingRepo: BookingRepository) {}

  execute(id: number): Promise<void> {
    return this.bookingRepo.confirmBooking(id);
  }

}