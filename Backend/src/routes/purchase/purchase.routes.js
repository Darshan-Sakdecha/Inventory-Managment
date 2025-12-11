import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { createPurchase, deletePurchase, getById, getPurchases, updatePurchase } from '../../controllers/purchase/purchase.controller.js';

const router = express.Router();

router.post("/createPurchase", authMiddleware, roleMiddleware("admin", "manager"), createPurchase);
router.get("/getPurchases", authMiddleware, getPurchases);
router.get("/:id", authMiddleware, getById);
router.put("/updatePurchase/:id", authMiddleware, roleMiddleware("admin", "manager"), updatePurchase);
router.delete("/deletePurchase/:id", authMiddleware, roleMiddleware("admin"), deletePurchase);

export default router;