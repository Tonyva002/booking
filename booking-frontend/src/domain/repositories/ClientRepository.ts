import type { Client } from "../entities/Client";

export interface ClientRepository {
  findAll(): Promise<Client[]>;
  create(
    name: string,
    email: string,
    phone: string,
  ): Promise<{ success: boolean; client?: Client; error?: string }>;
}
