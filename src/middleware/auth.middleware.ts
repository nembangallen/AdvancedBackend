import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import type { AuthedRequest } from "../types/auth.types";

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (typeof header !== "string" || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing access token" });

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired access token" });
  }
}
