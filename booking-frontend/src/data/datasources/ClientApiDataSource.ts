import { api } from "../../core/api/axios";
import type { Client } from "../../domain/entities/Client";

export default class ClientApiDataSource { 
        async listClient(): Promise<Client[]> {
            const { data } = await api.get<Client[]>("/clients");
            return data;
        }       
}