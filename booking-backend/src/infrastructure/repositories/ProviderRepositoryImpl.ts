import { Provider } from "../../domain/entities/Provider";
import { ProviderRepository } from "../../domain/repositories/ProviderRepository";
import { pool } from "../database/connection";
import { RowDataPacket } from "mysql2";


export class MysqlProviderRepository implements ProviderRepository {

  // Obtiene la cantidad máxima de reservas por día para un proveedor.
  async getMaxBookingsPerDay(providerId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT max_bookings_per_day
       FROM providers
       WHERE id = ?`,
      [providerId],
    );

    return rows[0]?.max_bookings_per_day ?? 0;
  }

  // Verifica si un día específico de la semana es laborable para un proveedor.
  async isWorkingDay(providerId: number, dayOfWeek: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT EXISTS(
         SELECT 1
         FROM provider_working_days
         WHERE provider_id = ?
         AND day_of_week = ?
       ) AS is_working`,
      [providerId, dayOfWeek],
    );

    return rows[0]?.is_working === 1;
  }

  // Verifica si un proveedor tiene una fecha bloqueada (vacaciones o indisponibilidad).
  async isBlockedDate(providerId: number, date: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 1
       FROM provider_blocked_dates
       WHERE provider_id = ?
       AND blocked_date = ?`,
      [providerId, date],
    );

    return rows.length > 0;
  }


  // Listar los proveedores
  async list(): Promise<Provider[]> {

  const [rows] = await pool.query(
    `SELECT * FROM providers ORDER BY name`
  );

  return rows as Provider[];

}
}
