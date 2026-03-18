import type { Request } from "express";
import type { UserRole } from "../constants/roles";

export interface CurrentUser {
  id: string;
  role: UserRole;
}

export interface AuthedRequest extends Request {
  user?: CurrentUser;
}
