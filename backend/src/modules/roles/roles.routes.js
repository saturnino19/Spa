const { Router } = require("express");
const { asyncHandler } = require("../../utils/asyncHandler");
const rolesController = require("./roles.controller");

const router = Router();

router.get("/", asyncHandler(rolesController.list));
router.get("/:id", asyncHandler(rolesController.getById));
router.post("/", asyncHandler(rolesController.create));
router.patch("/:id", asyncHandler(rolesController.update));
router.delete("/:id", asyncHandler(rolesController.remove));

module.exports = router;
