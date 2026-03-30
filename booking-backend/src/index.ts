import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import bookingRoutes from "./presentation/routes/bookingRoutes";
import providerRoutes from "./presentation/routes/providerRoutes";
import clientRoutes from "./presentation/routes/clientRoutes";

const PORT = process.env.PORT || 4000;

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);


// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "booking-api",
  });
});


// Rutas API
app.use("/api/v1", bookingRoutes);
app.use("/api/v1", providerRoutes);
app.use("/api/v1", clientRoutes);


// Controlador de errores global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);

  res.status(500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});