import { Client } from "../entities/Client";

export interface ClientRepository {

  create(data: Omit<Client, "id">): Promise<number>;
  findAll(): Promise<Client[]>;
}
