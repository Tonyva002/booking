import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useProviderAvailabilityViewModel } from "../pages/provider-availability/useProviderAvailabilityViewModel";
import {
  getAvailabilityUseCase,
  createBookingUseCase,
  listProvidersUseCase,
} from "../../core/composition/compositionRoot";
import { BOOKING_STATUS } from "../../domain/enums/BookingStatus";

vi.mock("../../core/composition/compositionRoot", () => ({
  getAvailabilityUseCase: {
    execute: vi.fn(),
  },
  createBookingUseCase: {
    execute: vi.fn(),
  },
  listProvidersUseCase: {
    execute: vi.fn(),
  },
}));

describe("useProviderAvailabilityViewModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1
  it("debe listar y mapear los providers correctamente", async () => {
    vi.mocked(listProvidersUseCase.execute).mockResolvedValue([
      {
        id: 1,
        name: "Proveedor 1",
        max_bookings_per_day: 5,
      },
      {
        id: 2,
        name: "Proveedor 2",
        max_bookings_per_day: 3,
      },
    ]);

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    expect(result.current.providers).toEqual([]);
    expect(result.current.loadingProviders).toBe(false);

    await act(async () => {
      await result.current.fetchProviders();
    });

    expect(listProvidersUseCase.execute).toHaveBeenCalledTimes(1);
    expect(result.current.providers).toEqual([
      {
        id: 1,
        name: "Proveedor 1",
        maxBookingsPerDay: 5,
      },
      {
        id: 2,
        name: "Proveedor 2",
        maxBookingsPerDay: 3,
      },
    ]);
    expect(result.current.loadingProviders).toBe(false);
  });

  // TEST 2
  it("debe buscar y mapear la disponibilidad correctamente", async () => {
    vi.mocked(getAvailabilityUseCase.execute).mockResolvedValue({
      date: "2026-03-21",
      isAvailable: true,
      remainingSlots: 2,
      reason: "available",
    });

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    await act(async () => {
      await result.current.fetchAvailability(1, "2026-03-21");
    });

    expect(getAvailabilityUseCase.execute).toHaveBeenCalledWith(
      1,
      "2026-03-21"
    );

    expect(result.current.availability).toEqual([
      {
        date: "2026-03-21",
        remainingSlots: 2,
        reason: "available",
        available: true,
      },
    ]);
  });

  // TEST 3
  it("debe marcar available como false cuando no hay cupos", async () => {
    vi.mocked(getAvailabilityUseCase.execute).mockResolvedValue({
      date: "2026-03-21",
      isAvailable: false,
      remainingSlots: 0,
      reason: "full",
    });

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    await act(async () => {
      await result.current.fetchAvailability(1, "2026-03-21");
    });

    expect(result.current.availability).toEqual([
      {
        date: "2026-03-21",
        remainingSlots: 0,
        reason: "full",
        available: false,
      },
    ]);
  });

  // TEST 4
  it("debe crear una reserva correctamente", async () => {
    vi.mocked(createBookingUseCase.execute).mockResolvedValue({
      id: 1,
      provider_id: 1,
      client_id: 10,
      provider_name: "Proveedor 1",
      client_name: "Cliente 1",
      booking_date: "2026-03-21",
      status: BOOKING_STATUS.PENDING,
      version: 1,
    });

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    let response: { success: boolean; message?: string } | undefined;

    await act(async () => {
      response = await result.current.book(1, 10, "2026-03-21");
    });

    expect(createBookingUseCase.execute).toHaveBeenCalledWith(
      1,
      10,
      "2026-03-21"
    );

    expect(response).toEqual({ success: true });
  });


  // TEST 5
  it("debe retornar mensaje de error cuando createBookingUseCase falla con Error", async () => {
    vi.mocked(createBookingUseCase.execute).mockRejectedValue(
      new Error("Fecha no disponible")
    );

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    let response: { success: boolean; message?: string } | undefined;

    await act(async () => {
      response = await result.current.book(1, 10, "2026-03-21");
    });

    expect(response).toEqual({
      success: false,
      message: "Fecha no disponible",
    });
  });

  // TEST 6
  it('debe retornar "Error inesperado" cuando falla con un error desconocido', async () => {
    vi.mocked(createBookingUseCase.execute).mockRejectedValue("Error raro");

    const { result } = renderHook(() => useProviderAvailabilityViewModel());

    let response: { success: boolean; message?: string } | undefined;

    await act(async () => {
      response = await result.current.book(1, 10, "2026-03-21");
    });

    expect(response).toEqual({
      success: false,
      message: "Error inesperado",
    });
  });
});