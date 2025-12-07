import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { createSupplier, deleteSupplier, getById, getSuppliers, updateSupplier } from '../../controllers/supplier/supplier.controller.js';
const router = express.Router();

router.post("/createSupplier", authMiddleware, roleMiddleware("admin", "manager"), createSupplier);
router.get("/", authMiddleware, getSuppliers);
router.get("/:id", authMiddleware, getById);
router.put("/update/:id", authMiddleware, roleMiddleware("admin", "manager"), updateSupplier);
router.delete("/delete/:id", authMiddleware, roleMiddleware("admin"), deleteSupplier);

export default router;