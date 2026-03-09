import type { BookingRepository } from "../../repositories/BookingRepository";

export class CancelBookingUseCase {

  constructor(private bookingRepo: BookingRepository) {}

  execute(id: number): Promise<void> {
    return this.bookingRepo.cancelBooking(id);
  }

}