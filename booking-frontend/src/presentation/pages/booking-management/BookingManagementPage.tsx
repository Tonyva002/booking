import React, { useEffect, useState } from "react";
import {
  useBookingManagementViewModel,
  type BookingListItemViewModel,
} from "../booking-management/useBookingManagementViewModel";
import { BookingModal } from "../../components/BookingModal";

export const BookingManagementPage: React.FC = () => {
  const {
    bookings,
    fetchBookings,
    confirmBooking,
    cancelBooking,
    rescheduleBooking,
  } = useBookingManagementViewModel();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
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

  // 🔥 BOTÓN BASE UNIFICADO
  const baseBtn =
    "text-xs px-3 py-1.5 rounded border transition-all whitespace-nowrap";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Provider
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
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
                <tr key={b.id} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {b.providerName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.clientName}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{b.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={getStatusBadge(b.status)}>{b.status}</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4 min-w-55">
                      {b.status === "Pending" && (
                        <button
                          onClick={() => handleConfirm(b.id)}
                          className={`${baseBtn} bg-green-600 text-white border-green-600 hover:bg-green-700`}
                        >
                          Confirm
                        </button>
                      )}

                      {b.status !== "Canceled" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className={`${baseBtn} text-red-600 border-red-200 hover:bg-red-50`}
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => openRescheduleDialog(b.id)}
                        className={`${baseBtn} text-blue-600 border-blue-200 hover:bg-blue-50`}
                      >
                        Reschedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <BookingModal
        isOpen={isRescheduleOpen}
        title="Reschedule Booking"
        description="Select a new date"
        confirmText="Save changes"
        error={rescheduleError}
        isSubmitting={isSubmitting}
        onClose={closeRescheduleDialog}
        onConfirm={handleSubmitReschedule}
      >
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </BookingModal>
    </div>
  );
};
