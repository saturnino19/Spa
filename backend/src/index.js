const app = require("./app");
const { checkDatabaseConnection, pool } = require("./config/db");
const { env } = require("./config/env");

async function start() {
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
