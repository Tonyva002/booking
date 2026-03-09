import { Router } from "express";
import { BookingController } from "../controllers/BookingController";
import { validate } from "../middlewares/validate";
import {
  createBookingSchema,
  rescheduleSchema
} from "../validation/booking.schema";

const router = Router();

// Instancia del controlador de reservas
const controller = new BookingController();


// Listar todas las reservas
router.get("/bookings", controller.list);

// Crear una nueva reserva
router.post("/bookings", validate(createBookingSchema), controller.create);

// Confirmar una reserva
router.post("/bookings/:id/confirm", controller.confirm);

// Cancelar una reserva
router.post("/bookings/:id/cancel", controller.cancel);

// Reprogramar una reserva
router.post("/bookings/:id/reschedule", validate(rescheduleSchema), controller.reschedule);

export default router;