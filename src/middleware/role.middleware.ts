import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "../types/auth.types";
import type { UserRole } from "../constants/roles";

export function requireRole(role: UserRole | UserRole[]) {
  const allowed = Array.isArray(role) ? role : [role];

  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
