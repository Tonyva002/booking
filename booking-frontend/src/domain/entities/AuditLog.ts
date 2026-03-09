import type { AuditActions } from "../enums/AuditActions";

export interface AuditLog {
  id?: number;
  bookingId: number;
  action: AuditActions;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt?: string;
}