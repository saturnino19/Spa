import app from "./app";
import { checkDatabaseConnection, pool } from "./config/db";
import { env } from "./config/env";

async function start(): Promise<void> {
  try {
    await checkDatabaseConnection();
    console.log("PostgreSQL conectado correctamente.");
  } catch (error) {
    console.warn(
      "Aviso: No se pudo conectar a PostgreSQL al iniciar. Verifica que Docker/PostgreSQL esté corriendo.",
      error instanceof Error ? error.message : error
    );
  }

  const server = app.listen(env.port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();
