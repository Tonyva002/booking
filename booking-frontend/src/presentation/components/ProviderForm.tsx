import { useState } from "react";

interface ProviderFormProps {
  onCreateProvider: (
    name: string,
    maxBookingsPerDay: number,
  ) => Promise<{ success: boolean; message?: string }>;
}

export const ProviderForm = ({ onCreateProvider }: ProviderFormProps) => {
  const [name, setName] = useState("");
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isCreatingProvider, setIsCreatingProvider] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevenir el comportamiento por defecto (Refresh)
    e.preventDefault();

    // 2. Resetear estados de feedback
    setFormError("");
    setFormSuccess("");

    // 3. Validaciones iniciales (Limpieza de strings)
    const trimmedName = name.trim();
    const trimmedMaxBookings = maxBookingsPerDay.trim();

    if (!trimmedName || !trimmedMaxBookings) {
      setFormError("All provider fields are required");
      return;
    }

    // 4. Validación numérica
    const maxBookings = Number(trimmedMaxBookings);

    if (isNaN(maxBookings) || maxBookings <= 0) {
      setFormError("Max bookings per day must be a positive number");
      return;
    }

    // 5. Proceso de creación
    setIsCreatingProvider(true);

    try {
      // Usamos el valor ya limpiado (trimmedName)
      const result = await onCreateProvider(trimmedName, maxBookings);
      

      if (!result.success) {
        setFormError(result.message || "Failed to create provider");
        return;
      }

      // 6. Éxito: Limpiar formulario y mostrar mensaje
      setFormSuccess(result.message || "Provider created successfully");
      setName("");
      setMaxBookingsPerDay("");
      
    } catch (error) {
      console.error("Provider form error:", error);
      setFormError("Unexpected error while creating provider");
    } finally {
      // 7. Finalizar estado de carga pase lo que pase
      setIsCreatingProvider(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Create New Provider</h2>
        <p className="text-sm text-gray-500 mt-1">
          Create a new provider with daily booking capacity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Provider name"
            className="w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Max bookings per day
          </label>
          <input
            type="number"
            min="1"
            value={maxBookingsPerDay}
            onChange={(e) => setMaxBookingsPerDay(e.target.value)}
            placeholder="e.g. 5"
            className="w-full mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {formSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={isCreatingProvider}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all active:scale-95"
        >
          {isCreatingProvider ? "Creating Provider..." : "Create Provider"}
        </button>
      </form>
    </div>
  );
};