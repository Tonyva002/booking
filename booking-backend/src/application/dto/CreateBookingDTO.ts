export interface CreateBookingDTO {
  providerId: number;
  clientId: number;
  date: string;
  notes?: string;
}