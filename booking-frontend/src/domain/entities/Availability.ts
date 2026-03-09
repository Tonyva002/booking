export type AvailabilityReason =
  | "available"
  | "blocked"
  | "closed_day"
  | "full";

export interface Availability {
  date: string;
  isAvailable: boolean;
  remainingSlots: number;
  reason: AvailabilityReason;
}