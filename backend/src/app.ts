import cors from "cors";
import express from "express";
import { checkDatabaseConnection } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";
import clientsRoutes from "./modules/clients/clients.routes";
import rolesRoutes from "./modules/roles/roles.routes";
import { asyncHandler } from "./utils/asyncHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Spa Backend API",
    status: "running",
    endpoints: {
      health: "/health",
      roles: "/api/roles",
      clients: "/api/clients",
    },
  });
});

app.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const dbOk = await checkDatabaseConnection();
    res.json({ status: "ok", database: dbOk ? "connected" : "disconnected" });
  })
);

app.use("/api/roles", rolesRoutes);
app.use("/api/clients", clientsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

app.use(errorHandler);

export default app;
