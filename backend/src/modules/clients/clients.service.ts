import { query } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { buildPartialUpdate } from "../../utils/sql";

export type ClientType = "new" | "recurring";

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  client_type: ClientType;
  notes: string | null;
  registered_at: Date;
}

export interface CreateClientInput {
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  client_type?: ClientType;
  notes?: string | null;
}

export interface UpdateClientInput {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  client_type?: ClientType;
  notes?: string | null;
}

const UPDATABLE_FIELDS = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "address",
  "client_type",
  "notes",
] as const;

const VALID_CLIENT_TYPES: readonly ClientType[] = ["new", "recurring"];

function validateClientType(clientType: unknown): void {
  if (
    clientType !== undefined &&
    !VALID_CLIENT_TYPES.includes(clientType as ClientType)
  ) {
    throw new AppError(
      400,
      "El campo 'client_type' debe ser 'new' o 'recurring'."
    );
  }
}

export async function listClients(): Promise<Client[]> {
  const result = await query<Client>(
    'SELECT * FROM "clients" ORDER BY "id" ASC'
  );
  return result.rows;
}

export async function getClientById(id: number): Promise<Client> {
  const result = await query<Client>(
    'SELECT * FROM "clients" WHERE "id" = $1',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  if (!input.first_name?.trim() || !input.last_name?.trim()) {
    throw new AppError(
      400,
      "Los campos 'first_name' y 'last_name' son obligatorios."
    );
  }
  validateClientType(input.client_type);

  const result = await query<Client>(
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

export async function updateClient(
  id: number,
  input: UpdateClientInput
): Promise<Client> {
  if (input.first_name !== undefined && !input.first_name.trim()) {
    throw new AppError(400, "El campo 'first_name' no puede estar vacío.");
  }
  if (input.last_name !== undefined && !input.last_name.trim()) {
    throw new AppError(400, "El campo 'last_name' no puede estar vacío.");
  }
  validateClientType(input.client_type);

  const sanitized: UpdateClientInput = {
    ...input,
    first_name:
      input.first_name !== undefined ? input.first_name.trim() : undefined,
    last_name:
      input.last_name !== undefined ? input.last_name.trim() : undefined,
  };

  const statement = buildPartialUpdate("clients", id, sanitized, UPDATABLE_FIELDS);
  if (!statement) {
    throw new AppError(400, "Debes enviar al menos un campo para actualizar.");
  }

  const result = await query<Client>(statement.text, statement.values);
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

export async function deleteClient(id: number): Promise<Client> {
  const result = await query<Client>(
    'DELETE FROM "clients" WHERE "id" = $1 RETURNING *',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Cliente con id ${id} no encontrado.`);
  }
  return result.rows[0];
}
