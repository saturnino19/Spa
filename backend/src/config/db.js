const { Pool } = require("pg");
const { env } = require("./env");

/**
 * Shared PostgreSQL connection pool.
 */
const pool = new Pool(
  env.databaseUrl
    ? { connectionString: env.databaseUrl }
    : {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
      }
);

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

/**
 * Executes a parameterized SQL query against the shared pool.
 */
async function query(text, params) {
  return pool.query(text, params);
}

/**
 * Verifies database connectivity by running a lightweight query.
 */
async function checkDatabaseConnection() {
  const result = await pool.query("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
}

module.exports = { pool, query, checkDatabaseConnection };
