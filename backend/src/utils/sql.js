const { AppError } = require("./AppError");

/**
 * Parses a positive integer route parameter or throws a 400 AppError.
 */
function parsePositiveInt(raw, label = "id") {
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
function buildPartialUpdate(tableName, id, payload, allowedFields) {
  const assignments = [];
  const values = [];

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

module.exports = { parsePositiveInt, buildPartialUpdate };
