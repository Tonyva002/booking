import { Provider } from "../../../domain/entities/Provider";
import { ProviderRepository } from "../../../domain/repositories/ProviderRepository";

export class ListProvidersUseCase {

  constructor(
    private providerRepo: ProviderRepository
  ) {}

  async execute(): Promise<Provider[]> {

    try {

      const providers = await this.providerRepo.list();

      return providers;

    } catch (error) {
      console.error("Error real al recuperar proveedores:", error);
      throw new Error("Error al recuperar proveedores");

    }

  }

}