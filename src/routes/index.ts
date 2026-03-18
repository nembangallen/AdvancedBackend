import { Router } from "express";
import authRoutes from "./auth.routes";
import cafeRoutes from "./cafe.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cafes", cafeRoutes);
router.use("/users", userRoutes);

export default router;
