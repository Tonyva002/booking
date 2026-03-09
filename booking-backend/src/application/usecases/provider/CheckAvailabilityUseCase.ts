import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BookingRepository } from "../../../domain/repositories/BookingRepository";
import { ProviderRepository } from "../../../domain/repositories/ProviderRepository";
import { AvailabilityDTO } from "../../../application/dto/AvailabilityQueryDTO";
import { ReasonActions } from "../../../shared/reason-actions";

export class CheckAvailabilityUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private providerRepository: ProviderRepository,
  ) {}

  async execute(providerId: number, date: string): Promise<AvailabilityDTO> {
    
    if (!dayjs(date).isValid()) {
      throw new Error("Formato de fecha no válido");
    }
    dayjs.extend(customParseFormat);

    const parsedDate = dayjs(date, "YYYY-MM-DD");
    const formattedDate = parsedDate.format("YYYY-MM-DD"); 
    const dayOfWeek = parsedDate.day();

    // Chequear días laborales
    const isWorkingDay = await this.providerRepository.isWorkingDay(
      providerId,
      dayOfWeek,
    );

    if (!isWorkingDay) {
      return {
        date,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.ClosedDay,
      };
    }

    // Chequear fechas bloqueadas
    const isBlocked = await this.providerRepository.isBlockedDate(
      providerId,
      formattedDate,
    );

    if (isBlocked) {
      return {
        date,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.Blocked,
      };
    }

    // Contar reservas
    const bookings = await this.bookingRepository.countBookings(
      providerId,
      formattedDate, 
    );

    const maxBookings =
      await this.providerRepository.getMaxBookingsPerDay(providerId);

    const remaining = maxBookings - bookings;

    if (remaining <= 0) {
      return {
        date,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.Full,
      };
    }

    return {
      date,
      isAvailable: true,
      remainingSlots: remaining,
      reason: ReasonActions.Available,
    };
  }
}
