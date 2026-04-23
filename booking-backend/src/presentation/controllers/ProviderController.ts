import { Request, Response } from "express";
import { MysqlBookingRepository } from "../../infrastructure/repositories/BookingRepositoryImpl";
import { MysqlProviderRepository } from "../../infrastructure/repositories/ProviderRepositoryImpl";
import { CheckAvailabilityUseCase } from "../../application/usecases/provider/CheckAvailabilityUseCase";
import { ListProvidersUseCase } from "../../application/usecases/provider/ListProvidersUseCase";
import { CreateProviderUseCase } from "../../application/usecases/provider/CreateProviderUseCase";

const bookingRepo = new MysqlBookingRepository();
const providerRepo = new MysqlProviderRepository();

const availabilityUseCase = new CheckAvailabilityUseCase(
  bookingRepo,
  providerRepo,
);

const listProvidersUseCase = new ListProvidersUseCase(providerRepo);
const createProviderUseCase = new CreateProviderUseCase(providerRepo);

export class ProviderController {
  // Listar proveedores
  findAll = async (_req: Request, res: Response) => {
    try {
      const providers = await listProvidersUseCase.execute();
      return res.json(providers);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };

  // Crear proveedor
  create = async (req: Request, res: Response) => {
  try {
    const { name, maxBookingsPerDay } = req.body;

    if (!name || maxBookingsPerDay === undefined) {
      return res.status(400).json({
        error: "name and maxBookingsPerDay are required",
      });
    }

    const parsedMaxBookingsPerDay = Number(maxBookingsPerDay);

    if (Number.isNaN(parsedMaxBookingsPerDay)) {
      return res.status(400).json({
        error: "maxBookingsPerDay must be a valid number",
      });
    }

    const providerId = await createProviderUseCase.execute({
      name,
      maxBookingsPerDay: parsedMaxBookingsPerDay,
    });

    return res.status(201).json({
      success: true,
      providerId,
    });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

  // Verificar disponibilidad de un proveedor en una fecha
  availability = async (req: Request, res: Response) => {
    try {
      const providerId = Number(req.params.id);
      const date = req.query.date as string;

      if (isNaN(providerId) || !date) {
        return res.status(400).json({
          error: "providerId and date are required",
        });
      }

      const result = await availabilityUseCase.execute(providerId, date);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };
}
