import { Request, Response } from "express";

// Repositorios
import { MysqlBookingRepository } from "../../infrastructure/repositories/BookingRepositoryImpl";
import { MysqlProviderRepository } from "../../infrastructure/repositories/ProviderRepositoryImpl";
import { MysqlAuditRepository } from "../../infrastructure/repositories/AuditRepositoryImpl";

// Casos de uso
import { ConfirmBookingUseCase } from "../../application/usecases/booking/ConfirmBookingUseCase";
import { CreateBookingUseCase } from "../../application/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../application/usecases/booking/CancelBookingUseCase";
import { RescheduleBookingUseCase } from "../../application/usecases/booking/RescheduleBookingUseCase";
import { ListBookingsUseCase } from "../../application/usecases/booking/ListBookingsUseCase";
import { CheckAvailabilityUseCase } from "../../application/usecases/provider/CheckAvailabilityUseCase";

// Esquemas de Validación
import {
  createBookingSchema,
  rescheduleSchema,
} from "../validation/booking.schema";

// Libreria de validacion
import { z } from "zod";

// Repositorios
const bookingRepo = new MysqlBookingRepository();
const providerRepo = new MysqlProviderRepository();
const auditRepo = new MysqlAuditRepository();

// Caso de uso de disponibilidad
const availabilityUseCase = new CheckAvailabilityUseCase(
  bookingRepo,
  providerRepo
);

// Casos de uso
const createBookingUseCase = new CreateBookingUseCase(
  bookingRepo,
  auditRepo,
  availabilityUseCase
);

const cancelBookingUseCase = new CancelBookingUseCase(
  bookingRepo,
  auditRepo
);

const confirmBookingUseCase = new ConfirmBookingUseCase(
  bookingRepo,
  auditRepo
);

const rescheduleBookingUseCase = new RescheduleBookingUseCase(
  bookingRepo,
  auditRepo,
  availabilityUseCase
);

const listBookingsUseCase = new ListBookingsUseCase(
  bookingRepo
);

export class BookingController {


  // Listar las reservas
  list = async (_req: Request, res: Response) => {
    try {
      const bookings = await listBookingsUseCase.execute();
      return res.json(bookings);
    } catch (error: unknown) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno del servidor",
      });
    }
  };
 
  // Crea una nueva reserva
  create = async (req: Request, res: Response) => {
    try {
      const data = createBookingSchema.parse(req.body);
      const id = await createBookingUseCase.execute({
        providerId: data.providerId,
        clientId: data.clientId,
        date:
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date,
      });

      return res.status(201).json({
        bookingId: id,
      });

    } catch (error: unknown) {

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: error.issues,
        });
      }

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno del servidor",
      });

    }
  };
  
  
  // Reprograma una reserva existente
reschedule = async (req: Request, res: Response) => {
  try {

    const bookingId = Number(req.params.id);

    if (isNaN(bookingId)) {
      return res.status(400).json({
        error: "ID de reserva no válido",
      });
    }

    const data = rescheduleSchema.parse(req.body);

    const result = await rescheduleBookingUseCase.execute({
      bookingId: bookingId,
      newDate: data.newDate instanceof Date
        ? data.newDate.toISOString().split("T")[0]
        : data.newDate
  });

    return res.json(result);

  } catch (error: unknown) {

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.issues,
      });
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Error interno del servidor",
    });

  }
};

  // Cancela una reserva
  cancel = async (req: Request, res: Response) => {
    try {

      const bookingId = Number(req.params.id);

      if (isNaN(bookingId)) {
        return res.status(400).json({
          error: "ID de reserva no válido",
        });
      }

      await cancelBookingUseCase.execute(bookingId);

      return res.json({
        message: "Reserva cancelada exitosamente",
      });

    } catch (error: unknown) {

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno del servidor",
      });

    }
  };

  // Confirma una reserva
  confirm = async (req: Request, res: Response) => {
    try {

      const bookingId = Number(req.params.id);

      if (isNaN(bookingId)) {
        return res.status(400).json({
          error: "ID de reserva no válido",
        });
      }

      const result = await confirmBookingUseCase.execute(bookingId);

      return res.json(result);

    } catch (error: unknown) {

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno del servidor",
      });

    }
  };

}