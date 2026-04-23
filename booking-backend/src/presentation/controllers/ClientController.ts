import { Request, Response } from "express";
import { ClientRepositoryImpl } from "../../infrastructure/repositories/ClientRepositoryImpl";
import { ListClientsUseCase } from "../../application/usecases/client/ListClientsUseCase";
import { CreateClientUseCase } from "../../application/usecases/client/CreateClientUseCase";

const clientRepo = new ClientRepositoryImpl();

const listClientsUseCase = new ListClientsUseCase(clientRepo);
const createClientUseCase = new CreateClientUseCase(clientRepo);

export class ClientController {

  // GET /clients
  findAll = async (_req: Request, res: Response) => {
    try {
      const clients = await listClientsUseCase.execute();
      return res.json(clients);
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };

  // POST /clients
  create = async (req: Request, res: Response) => {
    try {     
      const { name, email, phone } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const newClientId = await createClientUseCase.execute({ name, email, phone });
      return res.status(201).json({ id: newClientId });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };
}
