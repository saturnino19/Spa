const { query } = require("../../config/db");
const { AppError } = require("../../utils/AppError");
const { buildPartialUpdate } = require("../../utils/sql");

const UPDATABLE_FIELDS = ["name", "description"];

async function listRoles() {
  const result = await query(
    'SELECT "id", "name", "description" FROM "roles" ORDER BY "id" ASC'
  );
  return result.rows;
}

async function getRoleById(id) {
  const result = await query(
    'SELECT "id", "name", "description" FROM "roles" WHERE "id" = $1',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

async function createRole(input) {
  if (typeof input?.name !== "string" || !input.name.trim()) {
    throw new AppError(400, "El campo 'name' es obligatorio.");
  }

  const result = await query(
    'INSERT INTO "roles" ("name", "description") VALUES ($1, $2) RETURNING "id", "name", "description"',
    [input.name.trim(), input.description ?? null]
  );
  return result.rows[0];
}

async function updateRole(id, input) {
  if (
    input?.name !== undefined &&
    (typeof input.name !== "string" || !input.name.trim())
  ) {
    throw new AppError(400, "El campo 'name' no puede estar vacío.");
  }

  const sanitized = {
    ...input,
    name: input?.name !== undefined ? input.name.trim() : undefined,
  };

  const statement = buildPartialUpdate("roles", id, sanitized, UPDATABLE_FIELDS);
  if (!statement) {
    throw new AppError(400, "Debes enviar al menos un campo para actualizar.");
  }

  const result = await query(statement.text, statement.values);
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

async function deleteRole(id) {
  const result = await query(
    'DELETE FROM "roles" WHERE "id" = $1 RETURNING "id", "name", "description"',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

module.exports = {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
