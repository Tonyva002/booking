import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useBookingManagementViewModel,
  type BookingManagementDependencies,
} from "../pages/booking-management/useBookingManagementViewModel";
import type { Booking } from "../../domain/entities/Booking";
import { BOOKING_STATUS } from "../../domain/enums/BookingStatus";

describe("useBookingManagementViewModel", () => {
  let mockDeps: BookingManagementDependencies;

  const mockBookings: Booking[] = [
    {
      id: 1,
      provider_id: 1,
      client_id: 1,
      provider_name: "Dr. Juan",
      client_name: "Pedro Pérez",
      booking_date: "2026-04-05",
      status: BOOKING_STATUS.PENDING,
      version: 1,
    },
    {
      id: 2,
      provider_id: 2,
      client_id: 2,
      provider_name: "Dra. Ana",
      client_name: "María López",
      booking_date: "2026-04-06",
      status: BOOKING_STATUS.CONFIRMED,
      version: 1,
    },
  ];

  beforeEach(() => {
    mockDeps = {
      getBookings: {
        execute: vi.fn(),
      },
      confirmBooking: {
        execute: vi.fn(),
      },
      cancelBooking: {
        execute: vi.fn(),
      },
      rescheduleBooking: {
        execute: vi.fn(),
      },
    };
  });

  it("debe iniciar con bookings vacío", () => {
    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    expect(result.current.bookings).toEqual([]);
  });

  it("debe cargar y mapear bookings correctamente con fetchBookings", async () => {
    vi.mocked(mockDeps.getBookings.execute).mockResolvedValue(mockBookings);

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    await act(async () => {
      await result.current.fetchBookings();
    });

    expect(mockDeps.getBookings.execute).toHaveBeenCalledTimes(1);

    expect(result.current.bookings[0]).toMatchObject({
      id: 1,
      providerName: "Dr. Juan",
      clientName: "Pedro Pérez",
      status: BOOKING_STATUS.PENDING,
    });

    expect(result.current.bookings[0].date).toContain("05/04/2026");

    expect(result.current.bookings[1]).toMatchObject({
      id: 2,
      providerName: "Dra. Ana",
      clientName: "María López",
      status: BOOKING_STATUS.CONFIRMED,
    });

    expect(result.current.bookings[1].date).toContain("06/04/2026");
  });

  it("debe confirmar una reserva y luego recargar bookings", async () => {
    vi.mocked(mockDeps.confirmBooking.execute).mockResolvedValue(undefined);
    vi.mocked(mockDeps.getBookings.execute).mockResolvedValue(mockBookings);

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    await act(async () => {
      await result.current.confirmBooking(1);
    });

    expect(mockDeps.confirmBooking.execute).toHaveBeenCalledWith(1);
    expect(mockDeps.getBookings.execute).toHaveBeenCalledTimes(1);
  });

  it("debe cancelar una reserva y luego recargar bookings", async () => {
    vi.mocked(mockDeps.cancelBooking.execute).mockResolvedValue(undefined);
    vi.mocked(mockDeps.getBookings.execute).mockResolvedValue(mockBookings);

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    await act(async () => {
      await result.current.cancelBooking(2);
    });

    expect(mockDeps.cancelBooking.execute).toHaveBeenCalledWith(2);
    expect(mockDeps.getBookings.execute).toHaveBeenCalledTimes(1);
  });

  it("debe reprogramar una reserva exitosamente", async () => {
    vi.mocked(mockDeps.rescheduleBooking.execute).mockResolvedValue(undefined);
    vi.mocked(mockDeps.getBookings.execute).mockResolvedValue(mockBookings);

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    let response;
    await act(async () => {
      response = await result.current.rescheduleBooking(1, "2026-04-10");
    });

    expect(mockDeps.rescheduleBooking.execute).toHaveBeenCalledWith(
      1,
      "2026-04-10"
    );
    expect(mockDeps.getBookings.execute).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ success: true });
  });

  it("debe retornar error controlado si falla rescheduleBooking", async () => {
    vi.mocked(mockDeps.rescheduleBooking.execute).mockRejectedValue(
      new Error("No se puede reprogramar")
    );

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    let response;
    await act(async () => {
      response = await result.current.rescheduleBooking(1, "2026-04-10");
    });

    expect(mockDeps.rescheduleBooking.execute).toHaveBeenCalledWith(
      1,
      "2026-04-10"
    );

    expect(response).toEqual({
      success: false,
      message: "No se puede reprogramar",
    });
  });

  it("debe retornar error inesperado si rescheduleBooking falla con algo no Error", async () => {
    vi.mocked(mockDeps.rescheduleBooking.execute).mockRejectedValue("falló");

    const { result } = renderHook(() =>
      useBookingManagementViewModel(mockDeps)
    );

    let response;
    await act(async () => {
      response = await result.current.rescheduleBooking(1, "2026-04-10");
    });

    expect(response).toEqual({
      success: false,
      message: "Unexpected error",
    });
  });
});