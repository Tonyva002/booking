import type { Booking } from "../../entities/Booking";
import type { BookingRepository } from "../../../domain/repositories/BookingRepository";

export class CreateBookingUseCase {

  constructor(private bookingRepo: BookingRepository) {}

  execute(
    providerId: number,
    clientId: number,
    date: string
  ): Promise<Booking> {

    return this.bookingRepo.createBooking(
      providerId,
      clientId,
      date
    );
  }

}