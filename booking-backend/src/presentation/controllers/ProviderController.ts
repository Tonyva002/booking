import { Request, Response } from "express";
import { MysqlBookingRepository } from "../../infrastructure/repositories/BookingRepositoryImpl";
import { MysqlProviderRepository } from "../../infrastructure/repositories/ProviderRepositoryImpl";
import { CheckAvailabilityUseCase } from "../../application/usecases/provider/CheckAvailabilityUseCase";
import { ListProvidersUseCase } from "../../application/usecases/provider/ListProvidersUseCase";

const bookingRepo = new MysqlBookingRepository();
const providerRepo = new MysqlProviderRepository();

const availabilityUseCase = new CheckAvailabilityUseCase(
  bookingRepo,
  providerRepo
);
const listProvidersUseCase = new ListProvidersUseCase(providerRepo);

export class ProviderController {

  // Listar los proveedores      
  list = async (_req: Request, res: Response) => {
    try {
      const providers = await listProvidersUseCase.execute();
      return res.json(providers);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error"
      });
    }
  };

  // Verifica la disponibilidad de un proveedor en una fecha
  availability = async (req: Request, res: Response) => {
    try {
      const providerId = Number(req.params.id);
      const date = req.query.date as string;

      if (isNaN(providerId) || !date) {
        return res.status(400).json({
          error: "providerId and date are required"
        });
      }

      const result = await availabilityUseCase.execute(providerId, date);

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error"
      });
    }
  };
}