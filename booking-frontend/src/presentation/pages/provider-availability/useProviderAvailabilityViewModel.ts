import { useCallback, useState } from "react";

import {
  getAvailabilityUseCase,
  createBookingUseCase,
  listProvidersUseCase,
  listClientsUseCase,
  createClientUseCase,
  createProviderUseCase,
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

  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Providers
  const fetchProviders = useCallback(async () => {
    setLoadingProviders(true);
    try {
      const data: Provider[] = await listProvidersUseCase.execute();

      setProviders(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          maxBookingsPerDay: p.max_bookings_per_day,
        })),
      );
    } finally {
      setLoadingProviders(false);
    }
  }, []);

  // Clients
  const fetchClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const data: Client[] = await listClientsUseCase.execute();
      setClients(data);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  // Availability 
  const fetchAvailability = useCallback(
    async (providerId: number, date: string) => {
      setLoadingAvailability(true);

      try {
        const data: Availability = await getAvailabilityUseCase.execute(
          providerId,
          date,
        );


        setAvailability([
          {
            date: data.date,
            remainingSlots: data.remainingSlots,
            reason: data.reason,
            available: data.isAvailable,
          },
        ]);
      } catch (error) {
        console.error(error);
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    },
    [],
  );

  // Booking
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

  // Create client
  const createClient = async (name: string, email: string, phone: string) => {
    try {
      const result = await createClientUseCase.execute(name, email, phone);

      if (!result.success) {
        return { success: false, message: result.error };
      }

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }

      return { success: false, message: "Error creando cliente" };
    }
  };

  // Create provider
  const createProvider = async (name: string, maxBookingsPerDay: number) => {
    try {
      await createProviderUseCase.execute(name, maxBookingsPerDay);
      return { success: true };
    } catch {
      return { success: false, message: "Error creando provider" };
    }
  };

  // Helpers
  const getProviderName = (id: number | null) =>
    providers.find((p) => p.id === id)?.name ?? "Selected provider";

  const getClientName = (id: number | null) =>
    clients.find((c) => c.id === id)?.name ?? "Selected client";

  return {
    providers,
    clients,
    availability,

    loadingProviders,
    loadingClients,
    loadingAvailability,

    fetchProviders,
    fetchClients,
    fetchAvailability,

    book,
    createClient,
    createProvider,

    getProviderName,
    getClientName,
  };
};
