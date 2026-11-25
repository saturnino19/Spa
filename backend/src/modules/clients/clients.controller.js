const { parsePositiveInt } = require("../../utils/sql");
const clientsService = require("./clients.service");

async function list(_req, res) {
  const clients = await clientsService.listClients();
  res.json(clients);
}

async function getById(req, res) {
  const id = parsePositiveInt(req.params.id);
  const client = await clientsService.getClientById(id);
  res.json(client);
}

async function create(req, res) {
  const created = await clientsService.createClient(req.body ?? {});
  res.status(201).json(created);
}

async function update(req, res) {
  const id = parsePositiveInt(req.params.id);
  const updated = await clientsService.updateClient(id, req.body ?? {});
  res.json(updated);
}

async function remove(req, res) {
  const id = parsePositiveInt(req.params.id);
  const deleted = await clientsService.deleteClient(id);
  res.json({ message: "Cliente eliminado correctamente.", data: deleted });
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
