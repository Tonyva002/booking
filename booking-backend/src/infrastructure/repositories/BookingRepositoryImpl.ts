import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { pool } from "../database/mysql";
import { Booking } from "../../domain/entities/Booking";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { BookingStatus } from "../../shared/booking-status";

// Interfaz de fila para el conteo de reservas
interface CountRow extends RowDataPacket {
  total: number;
}

export class MysqlBookingRepository implements BookingRepository {
  // Cuenta cuántas reservas existen para un proveedor en una fecha específica,
  // excluyendo reservas canceladas.
  async countBookings(providerId: number, date: string): Promise<number> {
    const [rows] = await pool.query<CountRow[]>(
      `SELECT COUNT(*) as total
       FROM bookings
       WHERE provider_id = ?
       AND booking_date = ?
       AND status != ?`,
      [providerId, date, BookingStatus.Canceled],
    );

    return rows[0].total;
  }

  // Crea una nueva reserva en la base de datos.
  async create(data: Partial<Booking>): Promise<number> {
    if (!data.provider_id || !data.client_id || !data.booking_date) {
      throw new Error("Missing booking data");
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bookings
       (provider_id, client_id, booking_date, status)
       VALUES (?, ?, ?, ?)`,
      [
        data.provider_id,
        data.client_id,
        data.booking_date,
        BookingStatus.Pending,
      ],
    );

    return result.insertId;
  }

  // Busca una reserva por su ID.
  async findById(id: number): Promise<Booking | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM bookings WHERE id = ?`,
      [id],
    );

    if (!rows.length) return null;

    return rows[0] as Booking;
  }

  // Buscar todas las reservas
  async list(): Promise<Booking[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        b.id,
        b.booking_date,
        b.status,
        b.version,
        p.name as provider_name,
        c.name as client_name
      FROM bookings b
      JOIN providers p ON p.id = b.provider_id
      JOIN clients c ON c.id = b.client_id
      ORDER BY b.booking_date DESC`,
    );

    return rows as Booking[];
  }

  // Actualiza la fecha de una reserva.
  // Usa control de versiones optimista (solo actualiza si la versión coincide).
  async rescheduleBooking(
    id: number,
    newDate: string,
    version: number,
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE bookings
       SET booking_date = ?, version = version + 1
       WHERE id = ? AND version = ?`,
      [newDate, id, version],
    );

    return result.affectedRows > 0;
  }

  // Actualiza el estado de una reserva.
  // Usa control de versiones optimista (solo actualiza si la versión coincide).
  async updateStatus(
    bookingId: number,
    status: BookingStatus,
    version: number,
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE bookings
       SET status = ?, version = version + 1
       WHERE id = ? AND version = ?`,
      [status, bookingId, version],
    );

    return result.affectedRows > 0;
  }
}
