import type { Availability } from "../entities/Availability";
import type { Provider } from "../entities/Provider";

export interface ProviderRepository {

  getAvailability(
    providerId: number,
    date: string
  ): Promise<Availability>;

  listProviders(): Promise<Provider[]>;

}