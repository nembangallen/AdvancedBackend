import { Router } from "express";
import { CafeController } from "../controllers/cafe.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { PERMISSIONS } from "../constants/permissions";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_READ),
  CafeController.list,
);

router.get(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_READ),
  CafeController.getById,
);

router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_CREATE),
  CafeController.create,
);

router.patch(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_UPDATE),
  CafeController.update,
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_DELETE),
  CafeController.remove,
);

router.patch(
  "/:id/assign-manager",
  requireAuth,
  requirePermission(PERMISSIONS.CAFE_ASSIGN_MANAGER),
  CafeController.assignManager,
);

export default router;
