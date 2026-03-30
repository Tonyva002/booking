import { useCallback, useState } from "react";

import {
  getAvailabilityUseCase,
  createBookingUseCase,
  listProvidersUseCase,
  listClientUseCase,
} from "../../../core/composition/compositionRoot";

import type { Provider } from "../../../domain/entities/Provider";
import type { Availability } from "../../../domain/entities/Availability";
import type { Client } from "../../../domain/entities/Client";

export interface AvailabilityListItemViewModel {
  date: string;
  remainingSlots: number;
  reason?: string;
  available: boolean;
}

export interface ProviderListItemViewModel {
  id: number;
  name: string;
  maxBookingsPerDay: number;
}

export const useProviderAvailabilityViewModel = () => {
  const [providers, setProviders] = useState<ProviderListItemViewModel[]>([]);
  const [availability, setAvailability] = useState<
    AvailabilityListItemViewModel[]
  >([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  // Listar proveedores
  const fetchProviders = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const data: Provider[] = await listProvidersUseCase.execute();

      const mapped: ProviderListItemViewModel[] = data.map((p) => ({
        id: p.id,
        name: p.name,
        maxBookingsPerDay: p.max_bookings_per_day,
      }));

      setProviders(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listar clientes
  const fetchClients = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const data: Client[] = await listClientUseCase.execute();
      setClients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar disponibilidad
  const fetchAvailability = async (
    providerId: number,
    date: string
  ): Promise<void> => {
    const data: Availability = await getAvailabilityUseCase.execute(
      providerId,
      date
    );

    const mapped: AvailabilityListItemViewModel[] = [
      {
        date: data.date,
        remainingSlots: data.remainingSlots,
        reason: data.reason,
        available: data.remainingSlots > 0,
      },
    ];

    setAvailability(mapped);
  };

  // Crear reserva
  const book = async (providerId: number, clientId: number, date: string) => {
    try {
      await createBookingUseCase.execute(providerId, clientId, date);
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }

      return { success: false, message: "Error inesperado" };
    }
  };

  return {
    providers,
    clients,
    availability,
    loadingProviders: loading,
    fetchProviders,
    fetchAvailability,
    fetchClients,
    book,
  };
};