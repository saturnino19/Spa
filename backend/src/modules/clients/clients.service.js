const { query } = require("../../config/db");
const { AppError } = require("../../utils/AppError");
const { buildPartialUpdate } = require("../../utils/sql");

const UPDATABLE_FIELDS = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "address",
  "client_type",
  "notes",
];

const VALID_CLIENT_TYPES = ["new", "recurring"];

function validateClientType(clientType) {
  if (clientType !== undefined && !VALID_CLIENT_TYPES.includes(clientType)) {
    throw new AppError(
      400,
      "El campo 'client_type' debe ser 'new' o 'recurring'."
    );
  }
}

async function listClients() {
  const result = await query('SELECT * FROM "clients" ORDER BY "id" ASC');
  return result.rows;
}

async function getClientById(id) {
  const result = await query('SELECT * FROM "clients" WHERE "id" = $1', [id]);
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

async function createClient(input) {
  if (
    typeof input?.first_name !== "string" ||
    !input.first_name.trim() ||
    typeof input?.last_name !== "string" ||
    !input.last_name.trim()
  ) {
    throw new AppError(
      400,
      "Los campos 'first_name' y 'last_name' son obligatorios."
    );
  }
  validateClientType(input.client_type);

  const result = await query(
    `INSERT INTO "clients" ("first_name", "last_name", "phone", "email", "address", "client_type", "notes")
     VALUES ($1, $2, $3, $4, $5, COALESCE($6::client_type, 'new'), $7)
     RETURNING *`,
    [
      input.first_name.trim(),
      input.last_name.trim(),
      input.phone ?? null,
      input.email ?? null,
      input.address ?? null,
      input.client_type ?? null,
      input.notes ?? null,
    ]
  );
  return result.rows[0];
}

async function updateClient(id, input) {
  if (
    input?.first_name !== undefined &&
    (typeof input.first_name !== "string" || !input.first_name.trim())
  ) {
    throw new AppError(400, "El campo 'first_name' no puede estar vacío.");
  }
  if (
    input?.last_name !== undefined &&
    (typeof input.last_name !== "string" || !input.last_name.trim())
  ) {
    throw new AppError(400, "El campo 'last_name' no puede estar vacío.");
  }
  validateClientType(input?.client_type);

  const sanitized = {
    ...input,
    first_name:
      input?.first_name !== undefined ? input.first_name.trim() : undefined,
    last_name:
      input?.last_name !== undefined ? input.last_name.trim() : undefined,
  };

  const statement = buildPartialUpdate("clients", id, sanitized, UPDATABLE_FIELDS);
  if (!statement) {
    throw new AppError(400, "Debes enviar al menos un campo para actualizar.");
  }

  const result = await query(statement.text, statement.values);
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

async function deleteClient(id) {
  const result = await query(
    'DELETE FROM "clients" WHERE "id" = $1 RETURNING *',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

module.exports = {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
