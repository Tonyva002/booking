import { Provider } from "../entities/Provider";

export interface ProviderRepository {

  getMaxBookingsPerDay(providerId: number): Promise<number>;

  isWorkingDay(providerId: number, dayOfWeek: number): Promise<boolean>;

  isBlockedDate(providerId: number, date: string): Promise<boolean>;

  list(): Promise<Provider[]>;

}