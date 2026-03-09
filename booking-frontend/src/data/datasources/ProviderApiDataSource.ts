import { api } from "../../core/api/axios";
import type { Availability } from "../../domain/entities/Availability";
import type { Provider } from "../../domain/entities/Provider";

export default class ProviderApiDataSource {

  // Verifica la disponibilidad de un proveedor en una fecha
  async getAvailability(
    providerId: number,
    date: string
  ): Promise<Availability> {

    const { data } = await api.get<Availability>(
      `/providers/${providerId}/availability`,
      { params: { date } }
    );

    return data;
  }

  // Listar los proveedores
  async listProviders(): Promise<Provider[]> {

    const { data } = await api.get<Provider[]>(
      "/providers"
    );

    return data;

  }

}