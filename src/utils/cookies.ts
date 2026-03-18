import type { Response } from "express";
import { env } from "../config/env";

const REFRESH_TOKEN = "refresjh_token";

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/auth/refresh",
  });
}

export function getRefreshCookie(req: any): string | undefined {
  return req.cookies?.[REFRESH_TOKEN];
}
