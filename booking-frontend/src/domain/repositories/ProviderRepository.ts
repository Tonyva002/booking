import type { Availability } from "../entities/Availability";
import type { Provider } from "../entities/Provider";

export interface ProviderRepository {
  getAvailability(providerId: number, date: string): Promise<Availability>;

  findAll(): Promise<Provider[]>;
  create(name: string, maxBookingsPerDay: number): Promise<Provider>;
}
