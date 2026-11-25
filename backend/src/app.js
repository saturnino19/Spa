const cors = require("cors");
const express = require("express");
const { checkDatabaseConnection } = require("./config/db");
const { errorHandler } = require("./middlewares/errorHandler");
const clientsRoutes = require("./modules/clients/clients.routes");
const rolesRoutes = require("./modules/roles/roles.routes");
const { asyncHandler } = require("./utils/asyncHandler");

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

module.exports = app;
