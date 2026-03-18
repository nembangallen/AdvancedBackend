import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middleware/login-rate-limit.middleware";
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", loginRateLimiter, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;
