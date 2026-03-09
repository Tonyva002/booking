import { ReasonActions } from "../../shared/reason-actions";

 export interface AvailabilityDTO {
  date: string;
  isAvailable: boolean;
  remainingSlots: number;
  reason: ReasonActions
}