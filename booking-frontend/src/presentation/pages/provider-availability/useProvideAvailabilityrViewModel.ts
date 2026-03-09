import {
  getAvailabilityUseCase,
  createBookingUseCase,
  listProvidersUseCase
} from "../../../core/composition/compositionRoot";

import type { Provider } from "../../../domain/entities/Provider";
import type { Availability } from "../../../domain/entities/Availability";

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

export class ProviderAvailabilityViewModel {
  providers: ProviderListItemViewModel[] = [];
  availability: AvailabilityListItemViewModel[] = [];

  // Listar proveedores
  async fetchProviders(): Promise<void> {
    const data: Provider[] = await listProvidersUseCase.execute();

    this.providers = data.map((p) => ({
      id: p.id,
      name: p.name,
      maxBookingsPerDay: p.maxBookingsPerDay
    }));
  }

  // Reservas disponibles
  async fetchAvailability(providerId: number, date: string): Promise<void> {
    const data: Availability = await getAvailabilityUseCase.execute(
      providerId,
      date
    );

    this.availability = [
      {
        date: data.date,
        remainingSlots: data.remainingSlots,
        reason: data.reason,
        available: data.remainingSlots > 0
      }
    ];
  }

  // Crear reserva
  async book(providerId: number, clientId: number, date: string) {
    try {
      await createBookingUseCase.execute(
        providerId,
        clientId,
        date
      );

      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: "Error inesperado" };
    }
  }
}