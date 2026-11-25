const { AppError } = require("../utils/AppError");

const PG_ERROR_MAP = {
  "23505": { status: 409, message: "Ya existe un registro con ese valor único." },
  "23503": { status: 400, message: "Referencia inválida o registro en uso por otra tabla." },
  "23502": { status: 400, message: "Falta un campo obligatorio." },
  "22P02": { status: 400, message: "Formato o valor ENUM inválido en la petición." },
};

/**
 * Global Express error-handling middleware translating AppError and PostgreSQL errors.
 */
function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err?.code && PG_ERROR_MAP[err.code]) {
    const mapped = PG_ERROR_MAP[err.code];
    res.status(mapped.status).json({
      error: mapped.message,
      detail: err.detail,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Error interno del servidor." });
}

module.exports = { errorHandler };
