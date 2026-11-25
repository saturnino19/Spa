const { Router } = require("express");
const { asyncHandler } = require("../../utils/asyncHandler");
const clientsController = require("./clients.controller");

const router = Router();

router.get("/", asyncHandler(clientsController.list));
router.get("/:id", asyncHandler(clientsController.getById));
router.post("/", asyncHandler(clientsController.create));
router.patch("/:id", asyncHandler(clientsController.update));
router.delete("/:id", asyncHandler(clientsController.remove));

module.exports = router;
