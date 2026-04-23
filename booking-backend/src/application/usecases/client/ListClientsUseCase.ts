import { Client } from "../../../domain/entities/Client";
import { ClientRepository } from "../../../domain/repositories/ClientRepository";

export class ListClientsUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return await this.clientRepo.findAll();
  }
}
