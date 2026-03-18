import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validators";
import {
  setRefreshCookie,
  clearRefreshCookie,
  getRefreshCookie,
} from "../utils/cookies";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = registerSchema.parse(req.body);
    const result = await AuthService.register(email, password);
    res
      .status(201)
      .json({ message: "User registered successfully", ...result });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);
    const { accessToken, refreshToken, user } = await AuthService.login(
      email,
      password,
    );
    setRefreshCookie(res, refreshToken);
    res.json({ message: "User logged in successfully", accessToken, user });
  }

  static async refresh(req: Request, res: Response) {
    const oldRefresh = getRefreshCookie(req);
    if (!oldRefresh)
      return res.status(401).json({ message: "Missing refresh token" });

    const { accessToken, refreshToken } = await AuthService.refresh(oldRefresh);
    setRefreshCookie(res, refreshToken);
    res.json({ message: "Token refreshed successfully", accessToken });
  }

  static async logout(req: Request, res: Response) {
    const refresh = getRefreshCookie(req);
    if (refresh) {
      await AuthService.logout(refresh);
    }
    clearRefreshCookie(res);
    res.json({ message: "Logged out successfully" });
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await AuthService.forgotPassword(email);
    res.json(result);
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(token, newPassword);
    res.json(result);
  }
}
