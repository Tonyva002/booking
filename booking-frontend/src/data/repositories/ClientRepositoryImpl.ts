import type { Client } from "../../domain/entities/Client";
import type { ClientRepository } from "../../domain/repositories/ClientRepository";
import type ClientApiDataSource from "../datasources/ClientApiDataSource";

export class ClientRepositoryImpl implements ClientRepository {
  constructor(private dataSource: ClientApiDataSource) {}

  // CREATE CLIENT
  create(
    name: string,
    email: string,
    phone: string,
  ): Promise<{ success: boolean; client?: Client; error?: string }> {
    return this.dataSource.create(name, email, phone);
  }

  // LIST CLIENTS
  findAll(): Promise<Client[]> {
    return this.dataSource.findAll();
  }
}
