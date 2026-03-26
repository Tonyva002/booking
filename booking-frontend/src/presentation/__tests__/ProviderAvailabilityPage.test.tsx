import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ProviderAvailabilityPage } from "../pages/provider-availability/ProviderAvailabilityPage";
import { useProviderAvailabilityViewModel } from "../pages/provider-availability/useProviderAvailabilityViewModel";

vi.mock("../pages/provider-availability/useProviderAvailabilityViewModel", () => ({
  useProviderAvailabilityViewModel: vi.fn(),
}));

describe("ProviderAvailabilityPage", () => {
  const mockFetchProviders = vi.fn();
  const mockFetchAvailability = vi.fn();
  const mockBook = vi.fn();

  const mockedUseProviderAvailabilityViewModel =
    useProviderAvailabilityViewModel as Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 0,
        },
        {
          id: 2,
          name: "Dr. Strange",
          maxBookingsPerDay: 0,
        },
      ],
      availability: [],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });
  });

  it("renders title and calls fetchProviders on mount", async () => {
    render(<ProviderAvailabilityPage />);

    expect(screen.getByText("Provider Availability")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetchProviders).toHaveBeenCalledTimes(1);
    });
  });

  it("disables check availability button initially", () => {
    render(<ProviderAvailabilityPage />);

    const button = screen.getByRole("button", {
      name: /check availability/i,
    });

    expect(button).toBeDisabled();
  });

  it("calls fetchAvailability when provider and date are selected", async () => {
    render(<ProviderAvailabilityPage />);

    const select = screen.getByRole("combobox");
    const dateInput = screen.getByLabelText(/search date/i);
    const button = screen.getByRole("button", {
      name: /check availability/i,
    });

    fireEvent.change(select, { target: { value: "1" } });
    fireEvent.change(dateInput, { target: { value: "2026-04-10" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetchAvailability).toHaveBeenCalledWith(1, "2026-04-10");
    });
  });

  it("renders availability rows", () => {
    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 0,
        },
      ],
      availability: [
        {
          date: "2026-04-10",
          remainingSlots: 2,
          available: true,
          reason: "available",
        },
        {
          date: "2026-04-11",
          remainingSlots: 0,
          available: false,
          reason: "Blocked by provider",
        },
      ],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });

    render(<ProviderAvailabilityPage />);

    expect(screen.getByText("2026-04-10")).toBeInTheDocument();
    expect(screen.getByText("2026-04-11")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book now/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /unavailable/i })).toBeInTheDocument();
    expect(screen.getByText("Blocked by provider")).toBeInTheDocument();
  });

  it("renders empty state message when there is no availability", () => {
    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 5,
        },
      ],
      availability: [],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });

    render(<ProviderAvailabilityPage />);

    expect(
      screen.getByText("Select a provider and date to see available slots")
    ).toBeInTheDocument();
  });

  it("opens booking dialog when clicking Book Now", () => {
    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 0,
        },
      ],
      availability: [
        {
          date: "2026-04-10",
          remainingSlots: 2,
          available: true,
          reason: "available",
        },
      ],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });

    render(<ProviderAvailabilityPage />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    fireEvent.click(screen.getByRole("button", { name: /book now/i }));

    const heading = screen.getByRole("heading", { name: /confirm booking/i });
    expect(heading).toBeInTheDocument();

    const modal = heading.closest("div");
    expect(modal).toBeTruthy();

    expect(screen.getAllByText("Dr. House").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-04-10").length).toBeGreaterThan(0);
  });

  it("confirms booking successfully", async () => {
    mockBook.mockResolvedValue({ success: true });

    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 0,
        },
      ],
      availability: [
        {
          date: "2026-04-10",
          remainingSlots: 2,
          available: true,
          reason: "available",
        },
      ],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });

    render(<ProviderAvailabilityPage />);

    const select = screen.getByRole("combobox");
    const dateInput = screen.getByLabelText(/search date/i);

    fireEvent.change(select, { target: { value: "1" } });
    fireEvent.change(dateInput, { target: { value: "2026-04-10" } });

    fireEvent.click(screen.getByRole("button", { name: /book now/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(mockBook).toHaveBeenCalledWith(1, 1, "2026-04-10");
    });

    await waitFor(() => {
      expect(mockFetchAvailability).toHaveBeenCalledWith(1, "2026-04-10");
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /confirm booking/i })
      ).not.toBeInTheDocument();
    });
  });

  it("shows error if booking fails", async () => {
    mockBook.mockResolvedValue({
      success: false,
      message: "No slots available",
    });

    mockedUseProviderAvailabilityViewModel.mockReturnValue({
      providers: [
        {
          id: 1,
          name: "Dr. House",
          maxBookingsPerDay: 0,
        },
      ],
      availability: [
        {
          date: "2026-04-10",
          remainingSlots: 2,
          available: true,
          reason: "available",
        },
      ],
      loadingProviders: false,
      fetchProviders: mockFetchProviders,
      fetchAvailability: mockFetchAvailability,
      book: mockBook,
    });

    render(<ProviderAvailabilityPage />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    fireEvent.click(screen.getByRole("button", { name: /book now/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(mockBook).toHaveBeenCalledWith(1, 1, "2026-04-10");
    });

    expect(await screen.findByText("No slots available")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /confirm booking/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /confirm booking/i })
    ).toBeInTheDocument();
  });
});