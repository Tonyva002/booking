import { z } from "zod";

export const createBookingSchema = z.object({
  providerId: z.number(),
  clientId: z.number(),
  date: z.coerce.date()
});

export const rescheduleSchema = z.object({
  newDate: z.coerce.date(),

});