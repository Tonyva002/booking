import axios from "axios";
import { api } from "../../core/api/axios";
import type { Availability } from "../../domain/entities/Availability";
import type { Provider } from "../../domain/entities/Provider";

export default class ProviderApiDataSource {
  
  // Verifica la disponibilidad de un proveedor en una fecha
  async getAvailability(providerId: number, date: string ): Promise<Availability> {
    const { data } = await api.get<Availability>(
      `/providers/${providerId}/availability`,
      { params: { date } },
    );

    return data;
  }

  // Listar los proveedores
  async findAll(): Promise<Provider[]> {
    const { data } = await api.get<Provider[]>("/providers");

    return data;
  }

  // Crear un nuevo proveedor
  async create(name: string, maxBookingsPerDay: number): Promise<Provider> {
    try {
      const { data } = await api.post<Provider>("/providers", {
        name,
        maxBookingsPerDay,
      });
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error inesperado al crear el proveedor";

        throw new Error(message);
      }

      throw new Error("Error desconocido");
    }
  }
}
