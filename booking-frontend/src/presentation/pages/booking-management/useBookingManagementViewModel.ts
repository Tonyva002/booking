import { useState } from "react";
import {
  bookingUseCase
} from "../../../core/composition/compositionRoot";
import type { Booking } from "../../../domain/entities/Booking";

export interface BookingListItemViewModel {
  id: number;
  providerName: string;
  clientName: string;
  date: string;
  status: string;
}

export const useBookingManagementViewModel = () => {
  const [bookings, setBookings] = useState<BookingListItemViewModel[]>([]);

  // Formateador de fecha reutilizable
 const dateFormatter =  new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  

  const mapBooking = (booking: Booking): BookingListItemViewModel => ({
      id: booking.id!,
      providerName: booking.provider_name,
      clientName: booking.client_name,
      date: dateFormatter.format(new Date(booking.booking_date)),
      status: booking.status,
    });


  const fetchBookings = async () => {
    const data = await bookingUseCase.getBookings.execute();
    setBookings(data.map(mapBooking));
  };


  const confirmBooking = async (id: number) => {
      await bookingUseCase.confirmBooking.execute(id);
      await fetchBookings();
    };
  


  const cancelBooking = async (id: number) => {
      await bookingUseCase.cancelBooking.execute(id);
      await fetchBookings();
    };

  const rescheduleBooking = async (id: number, newDate: string) => {
      try {
        await bookingUseCase.rescheduleBooking.execute(id, newDate);
        await fetchBookings();
        return { success: true };
      } catch (error: unknown) {
        if (error instanceof Error)
          return { success: false, message: error.message };
        return { success: false, message: "Unexpected error" };
      }
    };

  return {
    bookings,
    fetchBookings,
    confirmBooking,
    cancelBooking,
    rescheduleBooking,
  };
};
