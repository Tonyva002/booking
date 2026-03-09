import { BookingRepository } from "../../../domain//repositories/BookingRepository";
import { AuditRepository } from "../../../domain/repositories/AuditRepository";
import { BookingStatus } from "../../../shared/booking-status";
import { AuditActions } from "../../../shared/audit-actions";

export class CancelBookingUseCase {

  constructor(
    private bookingRepository: BookingRepository,
    private auditRepository: AuditRepository
  ) {}

  async execute(bookingId: number) {

    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    if (booking.status === BookingStatus.Canceled) {
      throw new Error("Reserva ya cancelada");
    }

    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.Canceled,
      booking.version
    );

    if (!updated) {
      throw new Error("Conflicto de concurrencia al cancelar la reserva");
    }

    await this.auditRepository.log(
      bookingId,
      AuditActions.Canceled,
      booking,
      { status: BookingStatus.Canceled }
    );

    return true;
  }
}