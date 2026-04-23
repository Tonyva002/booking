import type { Provider } from "../../entities/Provider";
import type { ProviderRepository } from "../../repositories/ProviderRepository";


export class CreateProviderUseCase {

  constructor(private providerRepo: ProviderRepository) {}

  execute(
    name: string,
    maxBookingsPerDay: number
  ): Promise<Provider> {

    return this.providerRepo.create(
      name,
      maxBookingsPerDay
    );
  }

}