import { query } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { buildPartialUpdate } from "../../utils/sql";

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface CreateRoleInput {
  name: string;
  description?: string | null;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
}

const UPDATABLE_FIELDS = ["name", "description"] as const;

export async function listRoles(): Promise<Role[]> {
  const result = await query<Role>(
    'SELECT "id", "name", "description" FROM "roles" ORDER BY "id" ASC'
  );
  return result.rows;
}

export async function getRoleById(id: number): Promise<Role> {
  const result = await query<Role>(
    'SELECT "id", "name", "description" FROM "roles" WHERE "id" = $1',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

export async function createRole(input: CreateRoleInput): Promise<Role> {
  if (!input.name || !input.name.trim()) {
    throw new AppError(400, "El campo 'name' es obligatorio.");
  }

  const result = await query<Role>(
    'INSERT INTO "roles" ("name", "description") VALUES ($1, $2) RETURNING "id", "name", "description"',
    [input.name.trim(), input.description ?? null]
  );
  return result.rows[0];
}

export async function updateRole(
  id: number,
  input: UpdateRoleInput
): Promise<Role> {
  if (input.name !== undefined && !input.name.trim()) {
    throw new AppError(400, "El campo 'name' no puede estar vacío.");
  }

  const sanitized: UpdateRoleInput = {
    ...input,
    name: input.name !== undefined ? input.name.trim() : undefined,
  };

  const statement = buildPartialUpdate("roles", id, sanitized, UPDATABLE_FIELDS);
  if (!statement) {
    throw new AppError(400, "Debes enviar al menos un campo para actualizar.");
  }

  const result = await query<Role>(statement.text, statement.values);
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}

export async function deleteRole(id: number): Promise<Role> {
  const result = await query<Role>(
    'DELETE FROM "roles" WHERE "id" = $1 RETURNING "id", "name", "description"',
    [id]
  );
  if (result.rows.length === 0) {
    throw new AppError(404, `Rol con id ${id} no encontrado.`);
  }
  return result.rows[0];
}
