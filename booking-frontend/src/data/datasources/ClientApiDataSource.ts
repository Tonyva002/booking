import axios from "axios";
import { api } from "../../core/api/axios";
import type { Client } from "../../domain/entities/Client";

export default class ClientApiDataSource {
  // LIST CLIENTS
  async findAll(): Promise<Client[]> {
    const { data } = await api.get<Client[]>("/clients");
    return data;
  }

  // CREATE CLIENT
  async create(
    name: string,
    email: string,
    phone: string,
  ): Promise<{ success: boolean; client?: Client; error?: string }> {
    try {
      const { data } = await api.post<Client>("/clients", {
        name,
        email,
        phone,
      });

      return { success: true, client: data };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error inesperado al crear el cliente";

        return { success: false, error: message };
      }

      return { success: false, error: "Error desconocido" };
    }
  }
}
