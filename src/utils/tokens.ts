import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { UserRole } from "../constants/roles";

export type AccessPayload = { sub: string; role: UserRole };
export type RefreshPayload = { sub: string; sid: string };

export function signAccessToken(userId: string, role: UserRole) {
  const payload: AccessPayload = { sub: userId, role };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL,
  });
}

export function signRefreshToken(userId: string, sessionId: string) {
  const payload: RefreshPayload = { sub: userId, sid: sessionId };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
}
