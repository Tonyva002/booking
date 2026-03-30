import { Router } from "express";

const router = Router();

import { ClientController } from "../controllers/ClientController";

const controller = new ClientController();

// Listar clientes
router.get("/clients", controller.list);

export default router;