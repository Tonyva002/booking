import { Client } from "../../domain/entities/Client";
import { ClientRepository } from "../../domain/repositories/ClientRepository";
import { db } from "../database/mysql";

export class ClientRepositoryImpl implements ClientRepository {

  // Crear un nuevo cliente
  async create(data: Omit<Client, "id">): Promise<number> {
    const [result]: any = await db.execute(
      `
      INSERT INTO clients (name, email, phone)
      VALUES (?, ?, ?)
      `,
      [data.name, data.email, data.phone]
    );

    return result.insertId;
  }
  
  // Listar los clientes
  async findAll(): Promise<Client[]> {
    const [rows] = await db.query(`SELECT * FROM clients ORDER BY name`);

    return rows as Client[];
  }

}
