import express from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { roleMiddleware } from '../../middlewares/role.middleware.js'
import { createStock, deleteStock, getAllStocks, getStockByProduct, updateStock } from '../../controllers/stock/stock.controller.js';

const router = express.Router();

router.post("/createStock", authMiddleware, roleMiddleware("admin", "manager"), createStock);
router.get("/getStocks", authMiddleware, getAllStocks);
router.get("/getStockByProduct/:id", authMiddleware, getStockByProduct);
router.put("/updateStock/:id", authMiddleware, roleMiddleware("admin", "manager"), updateStock);
router.delete("/deleteStock/:id", authMiddleware, roleMiddleware("admin"), deleteStock);

export default router;