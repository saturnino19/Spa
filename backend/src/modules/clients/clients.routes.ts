import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as clientsController from "./clients.controller";

const router = Router();

router.get("/", asyncHandler(clientsController.list));
router.get("/:id", asyncHandler(clientsController.getById));
router.post("/", asyncHandler(clientsController.create));
router.patch("/:id", asyncHandler(clientsController.update));
router.delete("/:id", asyncHandler(clientsController.remove));

export default router;
