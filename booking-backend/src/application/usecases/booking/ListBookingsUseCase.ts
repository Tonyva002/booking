import { Booking } from "../../../domain/entities/Booking";
import { BookingRepository } from "../../../domain/repositories/BookingRepository";

export class ListBookingsUseCase {
  constructor(private bookingRepo: BookingRepository) {}

  async execute(): Promise<Booking[]> {
    try {
      const bookings = await this.bookingRepo.findAll();

      if (!bookings.length) {
        throw new Error("No hay reservas registradas");
      }

      return bookings;
    } catch (error) {
      throw new Error("Error obteniendo las reservas");
    }
  }
}
