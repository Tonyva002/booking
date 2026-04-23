import type { ProviderRepository } from "../../domain/repositories/ProviderRepository";
import type { Availability } from "../../domain/entities/Availability";
import type { Provider } from "../../domain/entities/Provider";
import ProviderApiDataSource from "../datasources/ProviderApiDataSource";

export class ProviderRepositoryImpl implements ProviderRepository {
  constructor(private dataSource: ProviderApiDataSource) {}

  // CREATE PROVIDER
  create(name: string, maxBookingsPerDay: number): Promise<Provider> {
    return this.dataSource.create(name, maxBookingsPerDay);
  }

  // Verifica la disponibilidad de un proveedor en una fecha
  getAvailability(providerId: number, date: string): Promise<Availability> {
    return this.dataSource.getAvailability(providerId, date);
  }

  // Lista todos los proveedores
  findAll(): Promise<Provider[]> {
    return this.dataSource.findAll();
  }
}
