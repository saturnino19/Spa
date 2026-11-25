import { AppError } from "./AppError";

/**
 * Parses a positive integer route parameter or throws a 400 AppError.
 */
export function parsePositiveInt(raw: string, label = "id"): number {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(400, `El parámetro '${label}' debe ser un entero positivo.`);
  }
  return parsed;
}

/**
 * Builds a parameterized SQL UPDATE query from a whitelisted subset of fields.
 * Returns null when no allowed fields are present in the payload.
 */
export function buildPartialUpdate<T extends object>(
  tableName: string,
  id: number,
  payload: Partial<T>,
  allowedFields: readonly (keyof T & string)[]
): { text: string; values: unknown[] } | null {
  const assignments: string[] = [];
  const values: unknown[] = [];

  for (const field of allowedFields) {
    const value = payload[field];
    if (value !== undefined) {
      values.push(value);
      assignments.push(`"${field}" = $${values.length}`);
    }
  }

  if (assignments.length === 0) {
    return null;
  }

  values.push(id);
  const text = `UPDATE "${tableName}" SET ${assignments.join(", ")} WHERE "id" = $${values.length} RETURNING *`;
  return { text, values };
}
