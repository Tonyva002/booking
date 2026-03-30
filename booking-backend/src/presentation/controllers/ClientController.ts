import { Request, Response } from "express";
import { ClientRepositoryImpl } from "../../infrastructure/repositories/ClientRepositoryImpl";
import { ListClientsUseCase } from "../../application/usecases/client/ListClientsUseCase";

const clientRepo = new ClientRepositoryImpl();
const listClientsUseCase = new ListClientsUseCase(clientRepo);

export class ClientController {
 
        list = async (_req: Request, res: Response) => {
            try {
              const clients = await listClientsUseCase.execute();
              return res.json(clients);
            } catch (error) {
              return res.status(500).json({
                error: error instanceof Error ? error.message : "Internal Server Error"
              });
            }
          };
}