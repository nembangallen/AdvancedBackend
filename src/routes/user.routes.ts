import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { PERMISSIONS } from "../constants/permissions";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.USER_READ),
  UserController.list,
);

router.patch(
  "/:id/role",
  requireAuth,
  requirePermission(PERMISSIONS.USER_UPDATE_ROLE),
  UserController.updateRole,
);

export default router;
