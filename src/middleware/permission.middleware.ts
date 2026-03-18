import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "../types/auth.types";
import { ROLE_PERMISSIONS } from "../constants/roles";
import type { Permission } from "../constants/permissions";

export function requirePermission(permission: Permission) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const permissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!permissions.includes(permission)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
