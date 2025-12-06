import express from 'express'
import { createCategory, deleteCategory, getAllCategory, getById, updateCategory } from '../../controllers/category/category.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
const router = express.Router();

// create 
router.post("/create", authMiddleware, roleMiddleware("admin", "manager"), createCategory);
router.get("/", getAllCategory);
router.get("/:id", getById);
router.put("/updateCategory/:id", authMiddleware, roleMiddleware("admin", "manager"), updateCategory)
router.delete("/deleteCategory/:id", authMiddleware, roleMiddleware("admin"), deleteCategory);

export default router;