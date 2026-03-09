import { AuditActions } from "../../shared/audit-actions";

export interface AuditRepository {

  log(
    bookingId: number,
    action: AuditActions,
    oldValue: any,
    newValue: any
  ): Promise<void>;

}