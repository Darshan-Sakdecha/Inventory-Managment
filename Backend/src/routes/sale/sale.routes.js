import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createSale, deleteSale, getById, getSales, updateSale } from '../../controllers/sale/sale.controller.js';

const router = express.Router();

router.post("/createSale", authMiddleware, roleMiddleware("admin", "manager"), createSale);
router.get("/getAll", authMiddleware, getSales);
router.get("/getById/:id", authMiddleware, getById);
router.put("/updateSale/:id", authMiddleware, roleMiddleware("admin", "manager"), updateSale);
router.delete("/deleteSale/:id", authMiddleware, roleMiddleware("admin"), deleteSale);

export default router;