import { Provider } from "../../../domain/entities/Provider";
import { ProviderRepository } from "../../../domain/repositories/ProviderRepository";

export class ListProvidersUseCase {
  constructor(private providerRepo: ProviderRepository) {}

  async execute(): Promise<Provider[]> {
    return await this.providerRepo.list();
  }
}