import type { Availability } from "../../entities/Availability";
import type { ProviderRepository } from "../../repositories/ProviderRepository";

export class GetAvailabilityUseCase {
  constructor(private providerRepo: ProviderRepository) {}

  execute(providerId: number, date: string): Promise<Availability> {
    return this.providerRepo.getAvailability(providerId, date);
  }
}
