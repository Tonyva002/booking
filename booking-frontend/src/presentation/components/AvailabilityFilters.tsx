import type { ProviderListItemViewModel } from "../pages/provider-availability/useProviderAvailabilityViewModel";

type ClientListItemViewModel = {
  id: number;
  name: string;
};

interface AvailabilityFiltersProps {
  providers: ProviderListItemViewModel[];
  clients: ClientListItemViewModel[];
  loadingProviders: boolean;
  selectedProvider: number | null;
  selectedClient: number | null;
  date: string;
  onProviderChange: (providerId: number | null) => void;
  onClientChange: (clientId: number | null) => void;
  onDateChange: (date: string) => void;
  onCheckAvailability: () => void;
}

export const AvailabilityFilters = ({
  providers,
  clients,
  loadingProviders,
  selectedProvider,
  selectedClient,
  date,
  onProviderChange,
  onClientChange,
  onDateChange,
  onCheckAvailability,
}: AvailabilityFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
        Create Booking
      </h1>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Provider */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-50">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Select Provider
          </label>

          <select
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
            value={selectedProvider ?? ""}
            onChange={(e) =>
              onProviderChange(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="" disabled>
              Choose a specialist...
            </option>

            {loadingProviders ? (
              <option>Loading providers...</option>
            ) : (
              providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Client */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-50">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Select Client
          </label>

          <select
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
            value={selectedClient ?? ""}
            onChange={(e) =>
              onClientChange(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="" disabled>
              Choose a client...
            </option>

            {clients.length === 0 ? (
              <option disabled>Loading clients...</option>
            ) : (
              clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={onCheckAvailability}
          disabled={!selectedProvider || !date}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all active:scale-95 h-10.5"
        >
          Check Availability
        </button>
      </div>

      {!selectedClient && (
        <p className="text-sm text-amber-500 font-medium">
          Please select provider and a client before booking an appointment.
        </p>
      )}
    </div>
  );
};