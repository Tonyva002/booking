import type { ProviderRepository } from "../../domain/repositories/ProviderRepository";
import type { Availability } from "../../domain/entities/Availability";
import type { Provider } from "../../domain/entities/Provider";
import ProviderApiDataSource from "../datasources/ProviderApiDataSource";

export class ProviderRepositoryImpl implements ProviderRepository {

  constructor(private dataSource: ProviderApiDataSource) {}

  // Verifica la disponibilidad de un proveedor en una fecha
  getAvailability(
    providerId: number,
    date: string
  ): Promise<Availability> {

    return this.dataSource.getAvailability(providerId, date);

  }


  // Listar los proveedores
  listProviders(): Promise<Provider[]> {

    return this.dataSource.listProviders();

  }

}