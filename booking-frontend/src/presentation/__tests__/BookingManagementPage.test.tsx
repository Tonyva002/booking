import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookingManagementPage } from "../pages/booking-management/BookingManagementPage";
import { BOOKING_STATUS } from "../../domain/enums/BookingStatus";
import { useBookingManagementViewModel } from "../pages/booking-management/useBookingManagementViewModel";

// Mock del hook
vi.mock("../pages/booking-management/useBookingManagementViewModel", () => ({
  useBookingManagementViewModel: vi.fn(),
}));


describe("BookingManagementPage", () => {
  const mockFetchBookings = vi.fn();
  const mockConfirmBooking = vi.fn();
  const mockCancelBooking = vi.fn();
  const mockRescheduleBooking = vi.fn();

  const mockBookings = [
    {
      id: 1,
      providerName: "Dr. Juan",
      clientName: "Pedro Pérez",
      date: "05/04/2026",
      status: BOOKING_STATUS.PENDING,
    },
    {
      id: 2,
      providerName: "Dra. Ana",
      clientName: "María López",
      date: "06/04/2026",
      status: BOOKING_STATUS.CONFIRMED,
    },
    {
      id: 3,
      providerName: "Dr. Luis",
      clientName: "Carlos Gómez",
      date: "07/04/2026",
      status: BOOKING_STATUS.CANCELED,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useBookingManagementViewModel).mockReturnValue({
      bookings: mockBookings,
      fetchBookings: mockFetchBookings,
      confirmBooking: mockConfirmBooking,
      cancelBooking: mockCancelBooking,
      rescheduleBooking: mockRescheduleBooking,
    });
  });

  //TEST 1 — RENDER DEL TÍTULO
  it("debe renderizar el título de la página", () => {
    render(<BookingManagementPage />);

    expect(screen.getByText("Booking Management")).toBeInTheDocument();
  });

  //TEST 2 — FETCH AL MONTAR
  it("debe llamar fetchBookings al montar", () => {
    render(<BookingManagementPage />);

    expect(mockFetchBookings).toHaveBeenCalled();
  });

  //TEST 3 — LISTA VACÍA
  it("debe mostrar mensaje vacío cuando no hay bookings", () => {
    vi.mocked(useBookingManagementViewModel).mockReturnValue({
      bookings: [],
      fetchBookings: mockFetchBookings,
      confirmBooking: mockConfirmBooking,
      cancelBooking: mockCancelBooking,
      rescheduleBooking: mockRescheduleBooking,
    });

    render(<BookingManagementPage />);

    expect(screen.getByText("No bookings found...")).toBeInTheDocument();
  });

  //TEST 4 — RENDER DE DATOS
  it("debe renderizar la lista de bookings", () => {
    render(<BookingManagementPage />);

    expect(screen.getByText("Dr. Juan")).toBeInTheDocument();
    expect(screen.getByText("Pedro Pérez")).toBeInTheDocument();
    expect(screen.getByText("05/04/2026")).toBeInTheDocument();

    expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
    expect(screen.getByText("María López")).toBeInTheDocument();
    expect(screen.getByText("06/04/2026")).toBeInTheDocument();
  });

  //TEST 5 — BOTÓN CONFIRM
  it("debe llamar confirmBooking al hacer click en Confirm", async () => {
    render(<BookingManagementPage />);

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockConfirmBooking).toHaveBeenCalledWith(1);
    });
  });

  //TEST 6 — BOTÓN CANCEL
  it("debe llamar cancelBooking al hacer click en Cancel", async () => {
    render(<BookingManagementPage />);

    const cancelButtons = screen.getAllByText("Cancel");
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(mockCancelBooking).toHaveBeenCalled();
    });
  });

  //TEST 7 — REFRESH LIST
  it("debe llamar fetchBookings al hacer click en Refresh List", async () => {
    render(<BookingManagementPage />);

    fireEvent.click(screen.getByText("Refresh List"));

    await waitFor(() => {
      expect(mockFetchBookings).toHaveBeenCalled();
    });
  });

  //TEST 8 — ABRIR MODAL RESCHEDULE
  it("debe abrir el modal al hacer click en Reschedule", () => {
    render(<BookingManagementPage />);

    const buttons = screen.getAllByText("Reschedule");
    fireEvent.click(buttons[0]);

    expect(screen.getByText("Reschedule Booking")).toBeInTheDocument();
    expect(screen.getByText("Select a new date for this booking.")).toBeInTheDocument();
  });

  //TEST 9 — ERROR SI NO HAY FECHA
  it("debe mostrar error si intenta guardar sin fecha", async () => {
    render(<BookingManagementPage />);

    fireEvent.click(screen.getAllByText("Reschedule")[0]);
    fireEvent.click(screen.getByText("Save changes"));

    expect(screen.getByText("Please select a new date.")).toBeInTheDocument();
  });

  //TEST 10 — REPROGRAMAR CON FECHA
  it("debe llamar rescheduleBooking con la fecha seleccionada", async () => {
    mockRescheduleBooking.mockResolvedValue({ success: true });

    render(<BookingManagementPage />);

    fireEvent.click(screen.getAllByText("Reschedule")[0]);

    const dateInput = screen.getByDisplayValue("") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-04-20" } });

    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(mockRescheduleBooking).toHaveBeenCalledWith(1, "2026-04-20");
    });
  });

  //TEST 11 — ERROR SI REPROGRAMAR FALLA
  it("debe mostrar error si rescheduleBooking falla", async () => {
    mockRescheduleBooking.mockResolvedValue({
      success: false,
      message: "No se puede reprogramar",
    });

    render(<BookingManagementPage />);

    fireEvent.click(screen.getAllByText("Reschedule")[0]);

    const dateInput = screen.getByDisplayValue("") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-04-20" } });

    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(screen.getByText("No se puede reprogramar")).toBeInTheDocument();
    });
  });

  //TEST 12 — CERRAR MODAL SI SALE BIEN
  it("debe cerrar el modal si rescheduleBooking sale bien", async () => {
    mockRescheduleBooking.mockResolvedValue({ success: true });

    render(<BookingManagementPage />);

    fireEvent.click(screen.getAllByText("Reschedule")[0]);

    const dateInput = screen.getByDisplayValue("") as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2026-04-20" } });

    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => {
      expect(screen.queryByText("Reschedule Booking")).not.toBeInTheDocument();
    });
  });
});