import { Pool, QueryResultRow } from "pg";
import { env } from "./env";

/**
 * Shared PostgreSQL connection pool.
 */
export const pool = new Pool(
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
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}

/**
 * Verifies database connectivity by running a lightweight query.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  const result = await pool.query("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
}
