import type { Client } from "../../entities/Client";
import type { ClientRepository } from "../../repositories/ClientRepository";

export class CreateClientUseCase {
  constructor(private clientRepo: ClientRepository) {}

  execute(
    name: string,
    email: string,
    phone: string,
  ): Promise<{ success: boolean; client?: Client; error?: string }> {
    return this.clientRepo.create(name, email, phone);
  }
}
