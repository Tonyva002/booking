import { Provider } from "../../domain/entities/Provider";
import { ProviderRepository } from "../../domain/repositories/ProviderRepository";
import { db } from "../database/mysql";
import { RowDataPacket } from "mysql2";

export class MysqlProviderRepository implements ProviderRepository {
  // Obtiene la cantidad máxima de reservas por día para un proveedor.
  async getMaxBookingsPerDay(providerId: number): Promise<number> {
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT max_bookings_per_day
       FROM providers
       WHERE id = ?`,
      [providerId],
    );

    return rows[0]?.max_bookings_per_day ?? 0;
  }

  // Verifica si un día específico de la semana es laborable para un proveedor.
  async isWorkingDay(providerId: number, dayOfWeek: number): Promise<boolean> {
    const [rows] = await db.query<RowDataPacket[]>(
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
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT 1
       FROM provider_blocked_dates
       WHERE provider_id = ?
       AND blocked_date = ?`,
      [providerId, date],
    );

    return rows.length > 0;
  }

  // Listar los proveedores
  async findAll(): Promise<Provider[]> {
    const [rows] = await db.query(`SELECT * FROM providers ORDER BY name`);

    return rows as Provider[];
  }

   async create(data: Omit<Provider, "id">): Promise<number> {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result]: any = await connection.execute(
      `
      INSERT INTO providers (name, max_bookings_per_day)
      VALUES (?, ?)
      `,
      [data.name, data.maxBookingsPerDay]
    );

    const providerId = result.insertId;

    // 🔥 INSERTAR DÍAS LABORALES POR DEFECTO (lunes a sábado)
    const days = [1, 2, 3, 4, 5, 6];

    for (const day of days) {
      await connection.execute(
        `
        INSERT INTO provider_working_days (provider_id, day_of_week)
        VALUES (?, ?)
        `,
        [providerId, day]
      );
    }

    await connection.commit();

    return providerId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
}
