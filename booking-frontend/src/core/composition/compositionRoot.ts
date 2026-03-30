// ------------------------------
// DataSources
// ------------------------------
import BookingApiDataSource from "../../data/datasources/BookingApiDataSource";
import ProviderApiDataSource from "../../data/datasources/ProviderApiDataSource";
import ClientApiDataSource from "../../data/datasources/ClientApiDataSource";

// ------------------------------
// Repositorios
// ------------------------------
import { BookingRepositoryImpl } from "../../data/repositories/BookingRepositoryImpl";
import { ProviderRepositoryImpl } from "../../data/repositories/ProviderRepositoryImpl";
import { ClientRepositoryImpl } from "../../data/repositories/ClientRepositoryImpl";  

// ------------------------------
// Casos de uso
// ------------------------------
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { GetAvailabilityUseCase } from "../../domain/usecases/provider/GetAvailabilityUseCase";
import { RescheduleBookingUseCase } from "../../domain/usecases/booking/RescheduleBookingUseCase";
import { ConfirmBookingUseCase } from "../../domain/usecases/booking/ConfirmBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingUseCase";
import { ListProvidersUseCase } from '../../domain/usecases/provider/ListProviderUseCase';
import { ListClientUseCase } from '../../domain/usecases/client/ListClientUseCase';

// ------------------------------
// Instancia de DataSources
// ------------------------------
const bookingApiDataSource = new BookingApiDataSource();
const providerApiDataSource = new ProviderApiDataSource();
const clientApiDataSource = new ClientApiDataSource();

// ------------------------------
// Instancia de Repositories
// ------------------------------
const bookingRepository = new BookingRepositoryImpl(bookingApiDataSource);
const providerRepository = new ProviderRepositoryImpl(providerApiDataSource);
const clientRepository = new ClientRepositoryImpl(clientApiDataSource);

// ------------------------------
// Instancia de UseCases
// ------------------------------
export const getAvailabilityUseCase = new GetAvailabilityUseCase(providerRepository);

export const listProvidersUseCase = new ListProvidersUseCase(providerRepository);

export const createBookingUseCase = new CreateBookingUseCase(bookingRepository);

export const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);

export const rescheduleBookingUseCase = new RescheduleBookingUseCase(
  bookingRepository,
);

export const confirmBookingUseCase = new ConfirmBookingUseCase(
  bookingRepository,
);

export const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

export const listClientUseCase = new ListClientUseCase(clientRepository);

export const bookingUseCase = {
  getBookings: getBookingsUseCase,
  confirmBooking: confirmBookingUseCase,
  cancelBooking: cancelBookingUseCase,
  rescheduleBooking: rescheduleBookingUseCase,
};
