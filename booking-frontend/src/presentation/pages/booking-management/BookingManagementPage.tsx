import React, { useEffect, useState } from "react";
import { BookingManagementViewModel } from "../booking-management/useBookingManagementViewModel";
import type { BookingListItemViewModel } from "../booking-management/useBookingManagementViewModel";

export const BookingManagementPage: React.FC = () => {
  const [viewModel] = useState(() => new BookingManagementViewModel());
  const [bookings, setBookings] = useState<BookingListItemViewModel[]>([]);

  useEffect(() => {
    const load = async () => {
      await viewModel.fetchBookings();
      setBookings([...viewModel.bookings]);
    };
    load();
  }, [viewModel]);

  // Handlers (Mantenemos tu lógica MVVM intacta)
  const refreshData = async () => {
    await viewModel.fetchBookings();
    setBookings([...viewModel.bookings]);
  };

  const handleConfirm = async (id: number) => {
    await viewModel.confirmBooking(id);
    await refreshData();
  };

  const handleCancel = async (id: number) => {
    await viewModel.cancelBooking(id);
    await refreshData();
  };

  const handleReschedule = async (id: number) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD)");
    if (!newDate) return;
    const result = await viewModel.rescheduleBooking(id, newDate);
    if (!result.success) {
      alert(result.message);
      return;
    }
    await refreshData();
  };

  // Helper para el color de los estados
  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
    switch (status) {
      case "Pending": return `${base} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case "Confirmed": return `${base} bg-green-100 text-green-800 border border-green-200`;
      case "Canceled": return `${base} bg-red-100 text-red-800 border border-red-200`;
      default: return `${base} bg-gray-100 text-gray-800`;
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                  No bookings found...
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900">{b.providerName}</td>
                  <td className="px-6 py-4 text-gray-600">{b.clientName}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{b.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={getStatusBadge(b.status)}>
                      {b.status}
                    </span>
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
                      onClick={() => handleReschedule(b.id)}
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
      
      {/* Mini-footer para auditoría */}
      <p className="text-[10px] text-gray-400 text-right uppercase tracking-widest">
        Fullstack Technical Test - Concurrency & Audit logs enabled
      </p>
    </div>
  );
};