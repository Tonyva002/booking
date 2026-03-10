import dayjs from "dayjs";
import { BookingRepository } from "../../../domain/repositories/BookingRepository";
import { AuditRepository } from "../../../domain/repositories/AuditRepository";
import { CheckAvailabilityUseCase } from "../provider/CheckAvailabilityUseCase";
import { BookingStatus } from "../../../shared/booking-status";
import { AuditActions } from "../../../shared/audit-actions";
import { RescheduleBookingDTO } from "../../dto/RescheduleBookingDTO";

export class RescheduleBookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private auditRepository: AuditRepository,
    private availabilityUseCase: CheckAvailabilityUseCase,
  ) {}

  async execute(dto: RescheduleBookingDTO) {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    if (booking.status === BookingStatus.Canceled) {
      throw new Error("Las reservas canceladas no se pueden reprogramar");
    }

    const today = dayjs();
    const bookingDate = dayjs(booking.booking_date);

    const diffDays = bookingDate.diff(today, "day");

    if (diffDays < 3) {
      throw new Error("No se puede reprogramar con menos de 3 días de aviso");
    }


    const availability = await this.availabilityUseCase.execute(
      booking.provider_id,
      dto.newDate,
    );

    if (!availability.isAvailable) {
      throw new Error("Nueva fecha no disponible");
    }

    const updated = await this.bookingRepository.rescheduleBooking(
      dto.bookingId,
      dto.newDate,
      booking.version,
    );

    if (!updated) {
      throw new Error(
        "La reserva fue modificada por otra solicitud. Intente nuevamente.",
      );
    }

    await this.auditRepository.log(
      dto.bookingId,
      AuditActions.Rescheduled,
      { booking_date: booking.booking_date },
      { booking_date: dto.newDate },
    );

    return {
      message: "Reserva reprogramada exitosamente",
    };
  }
}
