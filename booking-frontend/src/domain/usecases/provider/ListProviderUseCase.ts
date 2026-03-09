import type { Provider } from "../../../domain/entities/Provider";
import type { ProviderRepository } from "../../../domain/repositories/ProviderRepository";

export class ListProvidersUseCase {

  constructor(
    private providerRepository: ProviderRepository
  ) {}

   execute(): Promise<Provider[]> {
    return this.providerRepository.listProviders(); 

  }

}