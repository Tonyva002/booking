import { api } from "../../core/api/axios";
import type { Booking } from "../../domain/entities/Booking";
import type { Availability } from "../../domain/entities/Availability";
import axios from "axios";

export default class BookingApiDataSource {

  async getBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>("/bookings");
    console.log("Booking information", data)
    return data;
  }

  async confirmBooking(id: number): Promise<void> {
    await api.post(`/bookings/${id}/confirm`);
  }

  async cancelBooking(id: number): Promise<void> {
    await api.post(`/bookings/${id}/cancel`);
  }

  async rescheduleBooking(id: number, date: string): Promise<void> {
    await api.post(`/bookings/${id}/reschedule`, { newDate: date });
  }

  async getAvailability(
    providerId: number,
    start: string,
    end: string
  ): Promise<Availability[]> {
    const { data } = await api.get<Availability[]>(
      `/providers/${providerId}/availability`,
      { params: { from: start, to: end } }
    );
    return data;
  }

  async createBooking(
    providerId: number,
    clientId: number,
    date: string
  ): Promise<Booking> {
    try {
      const { data } = await api.post<Booking>("/bookings", {
        providerId,
        clientId,
        date,
      });

      return data;

    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error inesperado al crear la reserva";

        throw new Error(message);
      }

      throw new Error("Error desconocido");
    }
  }

}