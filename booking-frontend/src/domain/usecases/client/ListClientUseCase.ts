import type { Client } from "../../entities/Client";
import type { ClientRepository } from "../../repositories/ClientRepository";

export class ListClientUseCase {
  constructor(private clientRepo: ClientRepository) {}

  async execute(): Promise<Client[]> {
    return await this.clientRepo.findAll();
  }
}
