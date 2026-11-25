const { parsePositiveInt } = require("../../utils/sql");
const rolesService = require("./roles.service");

async function list(_req, res) {
  const roles = await rolesService.listRoles();
  res.json(roles);
}

async function getById(req, res) {
  const id = parsePositiveInt(req.params.id);
  const role = await rolesService.getRoleById(id);
  res.json(role);
}

async function create(req, res) {
  const created = await rolesService.createRole(req.body ?? {});
  res.status(201).json(created);
}

async function update(req, res) {
  const id = parsePositiveInt(req.params.id);
  const updated = await rolesService.updateRole(id, req.body ?? {});
  res.json(updated);
}

async function remove(req, res) {
  const id = parsePositiveInt(req.params.id);
  const deleted = await rolesService.deleteRole(id);
  res.json({ message: "Rol eliminado correctamente.", data: deleted });
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
