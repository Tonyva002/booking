import dayjs from "dayjs";
import { BookingRepository } from "../../../domain/repositories/BookingRepository";
import { AuditRepository } from "../../../domain/repositories/AuditRepository";
import { CreateBookingDTO } from "../../dto/CreateBookingDTO";
import { CheckAvailabilityUseCase } from "../provider/CheckAvailabilityUseCase";
import { AuditActions } from "../../../shared/audit-actions";

export class CreateBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private auditRepo: AuditRepository,
    private availabilityUseCase: CheckAvailabilityUseCase,
  ) {}

  async execute(dto: CreateBookingDTO): Promise<number> {
    const bookingDate = dayjs(dto.date);

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
      // Crear la reserva
      const bookingId = await this.bookingRepo.create({
        provider_id: dto.providerId,
        client_id: dto.clientId,
        booking_date: formattedDate,
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
        }
      );
      return bookingId;

    } catch (err: any) {

      if (err.code === "ER_DUP_ENTRY") {
        throw new Error(
          `El cliente ya reservó ese proveedor en esa fecha`
        );
      }

      throw err;
    }
  }
}