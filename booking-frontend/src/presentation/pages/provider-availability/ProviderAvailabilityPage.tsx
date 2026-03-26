import React, { useEffect, useState } from "react";

import {
  useProviderAvailabilityViewModel,
  type AvailabilityListItemViewModel,
  type ProviderListItemViewModel,
} from "./useProviderAvailabilityViewModel";

export const ProviderAvailabilityPage: React.FC = () => {
  const {
    providers,
    availability,
    loadingProviders,
    fetchProviders,
    fetchAvailability,
    book,
  } = useProviderAvailabilityViewModel();

  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Fetch providers
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Fetch availability when provider or date changes
  const loadAvailability = async () => {
    if (!selectedProvider || !date) return;
    await fetchAvailability(selectedProvider, date);
  };

  // Open dialog and reset state
  const openBookingDialog = (bookingDate: string) => {
    setSelectedBookingDate(bookingDate);
    setBookingError("");
    setIsBookingSubmitting(false);
    setIsBookingDialogOpen(true);
  };

  // Close dialog and reset state
  const closeBookingDialog = () => {
    setIsBookingDialogOpen(false);
    setSelectedBookingDate("");
    setBookingError("");
    setIsBookingSubmitting(false);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedProvider || !selectedBookingDate) return;

    setIsBookingSubmitting(true);
    setBookingError("");

    const result = await book(selectedProvider, 1, selectedBookingDate);

    if (!result.success) {
      setBookingError(result.message ?? "Unable to complete booking.");
      setIsBookingSubmitting(false);
      return;
    }

    await fetchAvailability(selectedProvider, date || selectedBookingDate);
    closeBookingDialog();
  };

  // Get provider name for display in booking dialog
  const selectedProviderName =
    providers.find((p) => p.id === selectedProvider)?.name ??
    "Selected provider";

  return (
    <div className="space-y-8">
      {/* Header y Filtros */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Provider Availability
        </h1>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Select Provider */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Select Provider
            </label>

            <select
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
              value={selectedProvider ?? ""}
              onChange={(e) =>
                setSelectedProvider(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
            >
              <option value="" disabled>
                Choose a specialist...
              </option>
              {loadingProviders ? (
                <option>Loading providers...</option>
              ) : (
                providers.map((p: ProviderListItemViewModel) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label
              htmlFor="search-date"
              className="text-xs font-bold text-gray-500 uppercase ml-1"
            >
              Search Date
            </label>

            <input
              id="search-date"
              type="date"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            onClick={loadAvailability}
            disabled={!selectedProvider || !date}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all active:scale-95 h-10.5"
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Remaining Slots
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status / Reason
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {availability.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <p className="text-sm italic">
                    Select a provider and date to see available slots
                  </p>
                </td>
              </tr>
            ) : (
              availability.map((a: AvailabilityListItemViewModel) => (
                <tr
                  key={a.date}
                  className={`transition-colors ${
                    a.available ? "hover:bg-blue-50/30" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {a.date}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block w-8 h-8 leading-8 rounded-full text-xs font-bold ${
                        a.remainingSlots > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {a.remainingSlots}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {a.available ? (
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Available for booking
                      </span>
                    ) : (
                      <span className="text-xs text-red-500 font-medium italic">
                        {a.reason ?? "Fully booked or blocked"}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {a.available ? (
                      <button
                        onClick={() => openBookingDialog(a.date)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Book Now
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-400 text-xs font-bold px-4 py-2 rounded cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOOKING MODAL */}
      {isBookingDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Booking
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review the booking details before continuing.
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Provider
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedProviderName}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Booking date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedBookingDate}
                  </p>
                </div>
              </div>

              {bookingError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {bookingError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeBookingDialog}
                disabled={isBookingSubmitting}
                className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmBooking}
                disabled={isBookingSubmitting}
                className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
              >
                {isBookingSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
