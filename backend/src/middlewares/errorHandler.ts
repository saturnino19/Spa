import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

interface PgError extends Error {
  code?: string;
  detail?: string;
}

const PG_ERROR_MAP: Record<string, { status: number; message: string }> = {
  "23505": { status: 409, message: "Ya existe un registro con ese valor único." },
  "23503": { status: 400, message: "Referencia inválida o registro en uso por otra tabla." },
  "23502": { status: 400, message: "Falta un campo obligatorio." },
  "22P02": { status: 400, message: "Formato o valor ENUM inválido en la petición." },
};

/**
 * Global Express error-handling middleware translating AppError and PostgreSQL errors.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  const pgErr = err as PgError;
  if (pgErr.code && PG_ERROR_MAP[pgErr.code]) {
    const mapped = PG_ERROR_MAP[pgErr.code];
    res.status(mapped.status).json({
      error: mapped.message,
      detail: pgErr.detail,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Error interno del servidor." });
}
