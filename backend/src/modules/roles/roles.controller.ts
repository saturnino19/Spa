import { Request, Response } from "express";
import { parsePositiveInt } from "../../utils/sql";
import * as rolesService from "./roles.service";

export async function list(_req: Request, res: Response): Promise<void> {
  const roles = await rolesService.listRoles();
  res.json(roles);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const role = await rolesService.getRoleById(id);
  res.json(role);
}

export async function create(req: Request, res: Response): Promise<void> {
  const created = await rolesService.createRole(req.body ?? {});
  res.status(201).json(created);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const updated = await rolesService.updateRole(id, req.body ?? {});
  res.json(updated);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const deleted = await rolesService.deleteRole(id);
  res.json({ message: "Rol eliminado correctamente.", data: deleted });
}
