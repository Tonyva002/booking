import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BookingTable } from "../components/BookingTable";
import { BOOKING_STATUS } from "../../domain/enums/BookingStatus";

const bookings = [
  {
    id: 1,
    providerId: 1,
    clientId: 1,
    bookingDate: "2026-03-10",
    status: BOOKING_STATUS.PENDING
  },
  {
    id: 2,
    providerId: 1,
    clientId: 2,
    bookingDate: "2026-03-11",
    status: BOOKING_STATUS.CONFIRMED
  },
  {
    id: 3,
    providerId: 1,
    clientId: 3,
    bookingDate: "2026-03-12",
    status: BOOKING_STATUS.CANCELED
  }
];

describe("BookingTable", () => {

  it("renders bookings", () => {

    render(
      <BookingTable
        bookings={bookings}
        onConfirm={() => {}}
        onCancel={() => {}}
        onReschedule={() => {}}
      />
    );

    expect(screen.getByText("2026")).toBeDefined();
    expect(screen.getByText("Pending")).toBeDefined();
    expect(screen.getByText("Confirmed")).toBeDefined();
    expect(screen.getByText("Canceled")).toBeDefined();

  });

  it("calls confirm handler", () => {

    const confirmMock = vi.fn();

    render(
      <BookingTable
        bookings={bookings}
        onConfirm={confirmMock}
        onCancel={() => {}}
        onReschedule={() => {}}
      />
    );

    const confirmButton = screen.getAllByText("Confirm")[0];

    fireEvent.click(confirmButton);

    expect(confirmMock).toHaveBeenCalledWith(1);

  });

  it("calls cancel handler", () => {

    const cancelMock = vi.fn();

    render(
      <BookingTable
        bookings={bookings}
        onConfirm={() => {}}
        onCancel={cancelMock}
        onReschedule={() => {}}
      />
    );

    const cancelButton = screen.getAllByText("Cancel")[0];

    fireEvent.click(cancelButton);

    expect(cancelMock).toHaveBeenCalled();

  });

  it("calls reschedule handler", () => {

    const rescheduleMock = vi.fn();

    global.prompt = vi.fn(() => "2026-03-20");

    render(
      <BookingTable
        bookings={bookings}
        onConfirm={() => {}}
        onCancel={() => {}}
        onReschedule={rescheduleMock}
      />
    );

    const rescheduleButton = screen.getAllByText("Reschedule")[0];

    fireEvent.click(rescheduleButton);

    expect(rescheduleMock).toHaveBeenCalledWith(1, "2026-03-20");

  });

  it("does not show confirm button for non-pending bookings", () => {

    render(
      <BookingTable
        bookings={bookings}
        onConfirm={() => {}}
        onCancel={() => {}}
        onReschedule={() => {}}
      />
    );

    const confirmButtons = screen.getAllByText("Confirm");

    expect(confirmButtons.length).toBe(1);

  });

});