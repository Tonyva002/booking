import type { AvailabilityListItemViewModel } from "../pages/provider-availability/useProviderAvailabilityViewModel";

interface AvailabilityTableProps {
  availability: AvailabilityListItemViewModel[];
  selectedClient: number | null;
  onBook: (bookingDate: string) => void;
}

export const AvailabilityTable  = ({
  availability,
  selectedClient,
  onBook,
}: AvailabilityTableProps) => {
  return (
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
              <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                <p className="text-sm italic">
                  Select a provider and date to see available slots
                </p>
              </td>
            </tr>
          ) : (
            availability.map((a) => (
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
                      onClick={() => onBook(a.date)}
                      disabled={!selectedClient}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded shadow hover:shadow-lg transition-all"
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
  );
};