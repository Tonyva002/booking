import dayjs from "dayjs";
import type { BookingRepository } from "../../../domain/repositories/BookingRepository";
import type { AuditRepository } from "../../../domain/repositories/AuditRepository";
import type { CreateBookingDTO } from "../../dto/CreateBookingDTO";
import { CheckAvailabilityUseCase } from "../provider/CheckAvailabilityUseCase";
import { AuditActions } from "../../../shared/audit-actions";
import { BookingStatus } from "../../../shared/booking-status";

export class CreateBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private auditRepo: AuditRepository,
    private availabilityUseCase: CheckAvailabilityUseCase,
  ) {}

  async execute(dto: CreateBookingDTO): Promise<number> {
    const bookingDate = dayjs(dto.date);

    // Validar fecha
    if (!bookingDate.isValid()) {
      throw new Error("La fecha no es válida");
    }

    // No permitir fechas pasadas
    if (bookingDate.isBefore(dayjs(), "day")) {
      throw new Error("No se pueden crear reservas en fechas pasadas");
    }

    // Verificar disponibilidad
    const availability = await this.availabilityUseCase.execute(
      dto.providerId,
      dto.date,
    );

    if (!availability.isAvailable) {
      throw new Error("No hay espacios disponibles");
    }

    const formattedDate = bookingDate.format("YYYY-MM-DD");

    try {
      // Crear la reserva siempre como Pending
      const bookingId = await this.bookingRepo.create({
        provider_id: dto.providerId,
        client_id: dto.clientId,
        booking_date: formattedDate,
        status: BookingStatus.Pending,
      });

      // Registrar auditoría
      await this.auditRepo.log(
        bookingId,
        AuditActions.Created,
        null,
        {
          provider_id: dto.providerId,
          client_id: dto.clientId,
          booking_date: formattedDate,
          status: BookingStatus.Pending,
          notes: dto.notes ?? null,
        }
      );

      return bookingId;
    } catch (err: any) {
      if (err?.code === "ER_DUP_ENTRY") {
        throw new Error(
          "El cliente ya reservó ese proveedor en esa fecha"
        );
      }

      throw err;
    }
  }
}