import { BookingRepository } from "../../../domain/repositories/BookingRepository";
import { AuditRepository } from "../../../domain/repositories/AuditRepository";
import { BookingStatus } from "../../../shared/booking-status";
import { AuditActions } from "../../../shared/audit-actions";

export class ConfirmBookingUseCase {
  constructor(
    private bookingRepo: BookingRepository,
    private auditRepo: AuditRepository,
  ) {}

  async execute(bookingId: number) {
    const booking = await this.bookingRepo.findById(bookingId);

    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    if (booking.status !== BookingStatus.Pending) {
      throw new Error("Sólo se podrán confirmar las reservas pendientes.");
    }

    const updated = await this.bookingRepo.updateStatus(
      bookingId,
      BookingStatus.Confirmed,
      booking.version,
    );

    if (!updated) {
      throw new Error("Conflicto de concurrencia al confirmar la reserva.");
    }

    await this.auditRepo.log(
      bookingId,
      AuditActions.Confirmed,
      { status: booking.status },
      { status: BookingStatus.Confirmed },
    );

    return {
      message: "Reserva confirmada",
    };
  }
}
