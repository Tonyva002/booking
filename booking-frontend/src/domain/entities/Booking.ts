import { BOOKING_STATUS } from '../enums/BookingStatus';

export interface Booking {
  id: number;
  provider_id: number;
  client_id: number;
  provider_name: string;
  client_name: string;
  booking_date: string;
  status: typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
  version: number;
  
}