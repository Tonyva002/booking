import type { Client } from "../../domain/entities/Client";
import type { ClientRepository } from "../../domain/repositories/ClientRepository";
import type ClientApiDataSource from "../datasources/ClientApiDataSource";

export class ClientRepositoryImpl implements ClientRepository {
        constructor(private dataSource: ClientApiDataSource) {}
        
        listClient(): Promise<Client[]> {
                return this.dataSource.listClient();
        }
}