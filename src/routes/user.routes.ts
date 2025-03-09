import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

// Define routes
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router; 