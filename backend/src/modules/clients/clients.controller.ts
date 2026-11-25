import { Request, Response } from "express";
import { parsePositiveInt } from "../../utils/sql";
import * as clientsService from "./clients.service";

export async function list(_req: Request, res: Response): Promise<void> {
  const clients = await clientsService.listClients();
  res.json(clients);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const client = await clientsService.getClientById(id);
  res.json(client);
}

export async function create(req: Request, res: Response): Promise<void> {
  const created = await clientsService.createClient(req.body ?? {});
  res.status(201).json(created);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const updated = await clientsService.updateClient(id, req.body ?? {});
  res.json(updated);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parsePositiveInt(req.params.id);
  const deleted = await clientsService.deleteClient(id);
  res.json({ message: "Cliente eliminado correctamente.", data: deleted });
}
