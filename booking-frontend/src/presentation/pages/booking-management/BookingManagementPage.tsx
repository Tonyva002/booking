import React, { useEffect, useState } from "react";
import {
  useBookingManagementViewModel,
  type BookingListItemViewModel,
} from "../booking-management/useBookingManagementViewModel";

export const BookingManagementPage: React.FC = () => {
  const {
    bookings,
    fetchBookings,
    confirmBooking,
    cancelBooking,
    rescheduleBooking,
  } = useBookingManagementViewModel();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const refreshData = async () => {
    await fetchBookings();
  };

  const handleConfirm = async (id: number) => {
    await confirmBooking(id);
    await refreshData();
  };

  const handleCancel = async (id: number) => {
    await cancelBooking(id);
    await refreshData();
  };

  const openRescheduleDialog = (id: number) => {
    setSelectedBookingId(id);
    setNewDate("");
    setRescheduleError("");
    setIsRescheduleOpen(true);
  };

  const closeRescheduleDialog = () => {
    setIsRescheduleOpen(false);
    setSelectedBookingId(null);
    setNewDate("");
    setRescheduleError("");
    setIsSubmitting(false);
  };

  const handleSubmitReschedule = async () => {
    if (!selectedBookingId) return;

    if (!newDate) {
      setRescheduleError("Please select a new date.");
      return;
    }

    setIsSubmitting(true);
    setRescheduleError("");

    const result = await rescheduleBooking(selectedBookingId, newDate);

    if (!result.success) {
      setRescheduleError(result.message || "Unable to reschedule booking.");
      setIsSubmitting(false);
      return;
    }

    await refreshData();
    closeRescheduleDialog();
  };

  const getStatusBadge = (status: string) => {
    const base =
      "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
    switch (status) {
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "Confirmed":
        return `${base} bg-green-100 text-green-800 border border-green-200`;
      case "Canceled":
        return `${base} bg-red-100 text-red-800 border border-red-200`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Booking Management
        </h1>
        <button
          onClick={refreshData}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded transition-colors"
        >
          Refresh List
        </button>
      </div>

      <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-400 italic"
                >
                  No bookings found...
                </td>
              </tr>
            ) : (
              bookings.map((b: BookingListItemViewModel) => (
                <tr
                  key={b.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {b.providerName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.clientName}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{b.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={getStatusBadge(b.status)}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {b.status === "Pending" && (
                      <button
                        onClick={() => handleConfirm(b.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded shadow-sm transition-all transform active:scale-95"
                      >
                        Confirm
                      </button>
                    )}

                    {b.status !== "Canceled" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 rounded border border-transparent hover:border-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => openRescheduleDialog(b.id)}
                      className="text-blue-600 hover:bg-blue-50 text-xs px-3 py-1.5 rounded border border-transparent hover:border-blue-200 transition-colors"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-gray-400 text-right uppercase tracking-widest">
        Fullstack Technical Test - Concurrency & Audit logs enabled
      </p>

      {/* MODAL */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Reschedule Booking
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select a new date for this booking.
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {rescheduleError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {rescheduleError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeRescheduleDialog}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReschedule}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};