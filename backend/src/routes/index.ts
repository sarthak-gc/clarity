import { Router } from "express";
import authRoutes from "./auth.routes";
import transactionRoutes from "./transaction.routes";
import categoriesRoutes from "./category.routes";
import { authMiddleware } from "../middleware/auth.middleware";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use(authMiddleware);
router.use("/dashboard", dashboardRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoriesRoutes);

export default router;
