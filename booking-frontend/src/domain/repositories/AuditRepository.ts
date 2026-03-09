import type { AuditActions } from "../enums/AuditActions";

export interface AuditRepository {
  log(
    bookingId: number,
    action: AuditActions,
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null
  ): Promise<void>;
}