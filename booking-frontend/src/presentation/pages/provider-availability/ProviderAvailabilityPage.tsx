import React, { useEffect, useState } from "react";
import { ProviderAvailabilityViewModel } from "../provider-availability/useProvideAvailabilityrViewModel";
import type { AvailabilityListItemViewModel, ProviderListItemViewModel } from "../provider-availability/useProvideAvailabilityrViewModel";

export const ProviderAvailabilityPage: React.FC = () => {
  const [viewModel] = useState(() => new ProviderAvailabilityViewModel());
  const [providers, setProviders] = useState<ProviderListItemViewModel[]>([]);
  const [availability, setAvailability] = useState<AvailabilityListItemViewModel[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      await viewModel.fetchProviders();
      setProviders([...viewModel.providers]);
    };
    loadProviders();
  }, [viewModel]);

  const loadAvailability = async () => {
    if (!selectedProvider || !date) return;
    await viewModel.fetchAvailability(selectedProvider, date);
    setAvailability([...viewModel.availability]);
  };

  const handleBook = async (bookingDate: string) => {
    if (!selectedProvider) return;
    const result = await viewModel.book(selectedProvider, 1, bookingDate);

    if (!result.success) {
      alert(result.message);
      return;
    }

    await viewModel.fetchAvailability(selectedProvider, bookingDate);
    setAvailability([...viewModel.availability]);
  };

  return (
    <div className="space-y-8">
      {/* Header y Filtros */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Provider Availability
        </h1>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Select Provider</label>
            <select
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
              value={selectedProvider ?? ""}
              onChange={(e) => setSelectedProvider(Number(e.target.value))}
            >
              <option value="" disabled>Choose a specialist...</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-50">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Search Date</label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Remaining Slots</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status / Reason</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {availability.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  <p className="text-sm italic">Select a provider and date to see available slots</p>
                </td>
              </tr>
            ) : (
              availability.map((a) => (
                <tr key={a.date} className={`transition-colors ${a.available ? 'hover:bg-blue-50/30' : 'bg-gray-50/50'}`}>
                  <td className="px-6 py-4 font-medium text-gray-900">{a.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block w-8 h-8 leading-8 rounded-full text-xs font-bold ${
                      a.remainingSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}>
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
                        onClick={() => handleBook(a.date)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded shadow hover:shadow-lg transition-all"
                      >
                        Book Now
                      </button>
                    ) : (
                      <button disabled className="bg-gray-200 text-gray-400 text-xs font-bold px-4 py-2 rounded cursor-not-allowed">
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
    </div>
  );
};