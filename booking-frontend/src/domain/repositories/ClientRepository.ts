import type { Client } from "../entities/Client";

export interface ClientRepository {
  listClient(): Promise<Client[]>;
}