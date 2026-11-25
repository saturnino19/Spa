import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as rolesController from "./roles.controller";

const router = Router();

router.get("/", asyncHandler(rolesController.list));
router.get("/:id", asyncHandler(rolesController.getById));
router.post("/", asyncHandler(rolesController.create));
router.patch("/:id", asyncHandler(rolesController.update));
router.delete("/:id", asyncHandler(rolesController.remove));

export default router;
