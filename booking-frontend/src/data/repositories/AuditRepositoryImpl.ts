import type { AuditRepository } from "../../domain/repositories/AuditRepository";
import type { AuditActions } from "../../domain/enums/AuditActions";
import AuditApiDataSource from "../datasources/AuditDataSource";

export class AuditRepositoryImpl implements AuditRepository {
  constructor(private dataSource: AuditApiDataSource) {}

  log(
    bookingId: number,
    action: AuditActions,
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null
  ): Promise<void> {
    return this.dataSource.log(bookingId, action, oldValue, newValue);
  }
}