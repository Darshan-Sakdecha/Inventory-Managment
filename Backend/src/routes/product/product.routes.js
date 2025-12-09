import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { createProduct, deleteProduct, getById, getProducts, updateProduct } from '../../controllers/product/product.controller.js';

const router = express.Router();

router.post("/createProduct", authMiddleware, roleMiddleware("admin", "manager"), upload.single("image"), createProduct);
router.get("/getProducts", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getById);
router.put("/updateProduct/:id", authMiddleware, roleMiddleware("admin", "manager"), upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router