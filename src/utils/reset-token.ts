import crypto from "crypto";
import { sha256 } from "./crypto";

export function generatePasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = sha256(rawToken);

  return { rawToken, tokenHash };
}
