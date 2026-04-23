import { Router } from "express";

const router = Router();

import { ClientController } from "../controllers/ClientController";

const controller = new ClientController();

// Listar clientes
router.get("/clients", controller.findAll);

// Crear cliente
router.post("/clients", controller.create);

export default router;
