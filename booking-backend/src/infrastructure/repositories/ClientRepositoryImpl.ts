import { Client } from '../../domain/entities/Client';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { db } from '../database/mysql';

export class ClientRepositoryImpl implements ClientRepository {
  create(client: Client): Promise<Client> {
          throw new Error('Method not implemented.');
  }

  // Listar los clientes
 async list(): Promise<Client[]> {
          const [rows] = await db.query(`SELECT * FROM clients ORDER BY name`);

    return rows as Client[];
  }

}