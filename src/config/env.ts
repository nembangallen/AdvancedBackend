import "dotenv/config";
import type { SignOptions, Secret } from "jsonwebtoken";

export const env = {
  PORT: Number(process.env.PORT ?? 5001),
  MONGO_URI: process.env.MONGO_URI ?? "",

  JWT_ACCESS_SECRET: (process.env.JWT_ACCESS_SECRET ?? "") as Secret,
  JWT_REFRESH_SECRET: (process.env.JWT_REFRESH_SECRET ?? "") as Secret,

  ACCESS_TOKEN_TTL: (process.env.ACCESS_TOKEN_TTL ??
    "15m") as SignOptions["expiresIn"],
  REFRESH_TOKEN_TTL: (process.env.REFRESH_TOKEN_TTL ??
    "7d") as SignOptions["expiresIn"],

  COOKIE_SECURE: (process.env.COOKIE_SECURE ?? "false") === "true",
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
};

for (const k of [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const) {
  if (!env[k]) throw new Error(`Missing env variable: ${k}`);
}
