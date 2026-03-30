import { useState } from "react";
import { bookingUseCase } from "../../../core/composition/compositionRoot";
import type { Booking } from "../../../domain/entities/Booking";

export interface BookingListItemViewModel {
  id: number;
  providerName: string;
  clientName: string;
  date: string;
  status: string;
}

export interface BookingManagementDependencies {
  getBookings: {
    execute: () => Promise<Booking[]>;
  };
  confirmBooking: {
    execute: (id: number) => Promise<void>;
  };
  cancelBooking: {
    execute: (id: number) => Promise<void>;
  };
  rescheduleBooking: {
    execute: (id: number, newDate: string) => Promise<void>;
  };
}

export const useBookingManagementViewModel = (
  deps: BookingManagementDependencies = bookingUseCase
) => {
  const [bookings, setBookings] = useState<BookingListItemViewModel[]>([]);

  const formatSqlDate = (value: string): string => {
    if (!value) return "";

    const onlyDate = value.split("T")[0]; // "2026-04-07"
    const [year, month, day] = onlyDate.split("-");

    if (!year || !month || !day) return value;

    return `${day}/${month}/${year}`;
  };

  const mapBooking = (booking: Booking): BookingListItemViewModel => ({
    id: booking.id!,
    providerName: booking.provider_name,
    clientName: booking.client_name,
    date: formatSqlDate(booking.booking_date),
    status: booking.status,
  });

  const fetchBookings = async () => {
    const data = await deps.getBookings.execute();
    setBookings(data.map(mapBooking));
  };

  const confirmBooking = async (id: number) => {
    await deps.confirmBooking.execute(id);
    await fetchBookings();
  };

  const cancelBooking = async (id: number) => {
    await deps.cancelBooking.execute(id);
    await fetchBookings();
  };

  const rescheduleBooking = async (id: number, newDate: string) => {
    try {
      await deps.rescheduleBooking.execute(id, newDate);
      await fetchBookings();
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
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