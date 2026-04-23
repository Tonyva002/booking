import type { ProviderRepository } from "../../../domain/repositories/ProviderRepository";
import type { CreateProviderDTO } from "../../dto/CreateProviderDTO";

export class CreateProviderUseCase {
  constructor(private providerRepo: ProviderRepository) {}

  async execute(dto: CreateProviderDTO): Promise<number> {
    const name = dto.name.trim();

    if (!name) {
      throw new Error("El nombre del proveedor es obligatorio");
    }

    if (dto.maxBookingsPerDay <= 0) {
      throw new Error(
        "La cantidad máxima de reservas por día debe ser mayor que 0"
      );
    }

    const providerId = await this.providerRepo.create({
      name,
      maxBookingsPerDay: dto.maxBookingsPerDay,
    });

    return providerId;
  }
}