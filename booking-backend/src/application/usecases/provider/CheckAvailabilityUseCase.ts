import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BookingRepository } from "../../../domain/repositories/BookingRepository";
import { ProviderRepository } from "../../../domain/repositories/ProviderRepository";
import { AvailabilityDTO } from "../../../application/dto/AvailabilityQueryDTO";
import { ReasonActions } from "../../../shared/reason-actions";

dayjs.extend(customParseFormat);

export class CheckAvailabilityUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private providerRepository: ProviderRepository,
  ) {}

  async execute(providerId: number, date: string): Promise<AvailabilityDTO> {
    // Parseo estricto de la fecha. Se espera el formato "YYYY-MM-DD". Si no es válido, se lanza un error.
    const parsedDate = dayjs(date, "YYYY-MM-DD", true);

    if (!parsedDate.isValid()) {
      throw new Error("Formato de fecha no válido");
    }

    const formattedDate = parsedDate.format("YYYY-MM-DD");
    // Obtiene el día de la semana (0: domingo, 1: lunes, ..., 6: sábado) para validar si el proveedor trabaja ese día.
    const dayOfWeek = parsedDate.day();

    // Valida si el proveedor trabaja ese día de la semana.
    const isWorkingDay = await this.providerRepository.isWorkingDay(
      providerId,
      dayOfWeek,
    );
 
    // Si no trabaja ese día, devolvemos inmediatamente el resultado.
    if (!isWorkingDay) {
      return {
        date: formattedDate,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.ClosedDay,
      };
    }

    // Valida si la fecha está bloqueada por el proveedor (ej: vacaciones, mantenimiento, etc).
    const isBlocked = await this.providerRepository.isBlockedDate(
      providerId,
      formattedDate,
    );

    // Si la fecha está bloqueada, no hay disponibilidad.
    if (isBlocked) {
      return {
        date: formattedDate,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.Blocked,
      };
    }

    // Contar cuántas reservas ya existen para esa fecha y proveedor.
    const bookings = await this.bookingRepository.countBookings(
      providerId,
      formattedDate,
    );

    // Recupera la capacidad máxima diaria del proveedor.
    const maxBookings =
      await this.providerRepository.getMaxBookingsPerDay(providerId);

    const remaining = maxBookings - bookings;

    // Si ya no quedan cupos, se devuelve como "lleno".
    if (remaining <= 0) {
      return {
        date: formattedDate,
        isAvailable: false,
        remainingSlots: 0,
        reason: ReasonActions.Full,
      };
    }

    //Si hay cupos disponibles, se devuelve como "disponible" junto con la cantidad de cupos restantes.
    return {
      date: formattedDate,
      isAvailable: true,
      remainingSlots: remaining,
      reason: ReasonActions.Available,
    };
  }
}