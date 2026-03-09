import type { BookingRepository } from "../../repositories/BookingRepository";

export class RescheduleBookingUseCase {

  constructor(private bookingRepo: BookingRepository) {}


  async execute(id: number, newDate: string): Promise<void> {
    await this.bookingRepo.rescheduleBooking(id, newDate);
  }

}