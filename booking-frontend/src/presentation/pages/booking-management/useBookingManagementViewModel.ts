/*import { repositories, rescheduleBookingUseCase } from "../../../core/composition/compositionRoot";
import type { Booking } from "../../../domain/entities/Booking";

export interface BookingListItemViewModel {
  id: number;
  providerName: string;
  clientName: string;
  date: string;
  status: string;
}

export class BookingManagementViewModel {

  bookings: BookingListItemViewModel[] = [];

  async fetchBookings() {
    const data = await repositories.bookingRepository.getBookings();

    this.bookings = data.map(booking => this.mapBooking(booking));
  }

  async confirmBooking(id: number) {
    await repositories.bookingRepository.confirmBooking(id);
    await this.fetchBookings();
  }

  async cancelBooking(id: number) {
    await repositories.bookingRepository.cancelBooking(id);
    await this.fetchBookings();
  }

  async rescheduleBooking(id: number, newDate: string) {
    try {
      await rescheduleBookingUseCase.execute(id, newDate);
      await this.fetchBookings();

      return { success: true };

    } catch (error: unknown) {

      if (error instanceof Error) {
        return { success: false, message: error.message };
      }

      return { success: false, message: "Unexpected error" };
    }
  }

  private mapBooking(booking: Booking): BookingListItemViewModel {
    return {
      id: booking.id!,
      providerName: booking.provider_name, 
      clientName: booking.client_name,
      date: booking.booking_date,
      status: booking.status,
    };
  }

}*/

import { repositories, rescheduleBookingUseCase } from "../../../core/composition/compositionRoot";
import type { Booking } from "../../../domain/entities/Booking";

export interface BookingListItemViewModel {
  id: number;
  providerName: string;
  clientName: string;
  date: string; 
  status: string;
}

export class BookingManagementViewModel {
  bookings: BookingListItemViewModel[] = [];

  // Formateador de fecha reutilizable
  private dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });

  async fetchBookings() {
    const data = await repositories.bookingRepository.getBookings();
    this.bookings = data.map(booking => this.mapBooking(booking));
  }

  async confirmBooking(id: number) {
    await repositories.bookingRepository.confirmBooking(id);
    await this.fetchBookings();
  }

  async cancelBooking(id: number) {
    await repositories.bookingRepository.cancelBooking(id);
    await this.fetchBookings();
  }

  async rescheduleBooking(id: number, newDate: string) {
    try {
      await rescheduleBookingUseCase.execute(id, newDate);
      await this.fetchBookings();
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) return { success: false, message: error.message };
      return { success: false, message: "Unexpected error" };
    }
  }

  private mapBooking(booking: Booking): BookingListItemViewModel {
    return {
      id: booking.id!,
      providerName: booking.provider_name, 
      clientName: booking.client_name,
      date: this.dateFormatter.format(new Date(booking.booking_date)),
      status: booking.status,
    };
  }
}