import { ResultSetHeader } from "mysql2";
import { AuditRepository } from "../../domain/repositories/AuditRepository";
import { AuditActions } from "../../shared/audit-actions";
import { pool } from "../database/connection";


export class MysqlAuditRepository implements AuditRepository {
  /**
   * Registra una acción de auditoría para una reserva (cambios en las reservas).
   * @param bookingId - ID de la reserva afectada
   * @param action - Acción realizada (AuditActions: Created, Canceled, Rescheduled)
   * @param oldValue - Estado anterior de la reserva (puede ser null)
   * @param newValue - Nuevo estado de la reserva (puede ser null)
   * @note Los objetos oldValue y newValue se convierten a JSON antes de insertarse en la base de datos.
   */
  async log(
    bookingId: number,
    action: AuditActions,
    oldValue: Record<string, unknown> | null,
    newValue: Record<string, unknown> | null,
  ): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO booking_audit_log
       (booking_id, action, old_value, new_value)
       VALUES (?, ?, ?, ?)`,
      [
        bookingId,
        action,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
      ],
    );
  }
}
