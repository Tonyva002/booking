import { Router } from "express";
import { ProviderController } from "../controllers/ProviderController";

const router = Router();
const controller = new ProviderController();

// Listar proveedores
router.get("/providers", controller.list);

// Obtener disponibilidad de un proveedor en una fecha
router.get("/providers/:id/availability", controller.availability);

export default router;