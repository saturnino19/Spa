const dotenv = require("dotenv");

dotenv.config();

/**
 * Validated runtime configuration loaded from environment variables.
 */
const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "spa_user",
    password: process.env.DB_PASSWORD || "spa_password",
    database: process.env.DB_NAME || "spa_db",
  },
};

module.exports = { env };
