import { Stock } from "../../models/stock.models.js";
import { Product } from "../../models/product.models.js";

export const createStock = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: "ProductId and quantity required"
            });
        }
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const existing = await Stock.findOne({ productId })
        if (existing) {
            return res.status(400).json({
                message: "Stock already exists for this product"
            });
        }

        const stock = await Stock.create({
            productId,
            quantity,
            updatedBy: req.user.id,
            updatedByRole: req.user.role
        });

        res.status(201).json({
            message: "Stock created successfully",
            data: stock
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({})
            .populate("productId", "name price")
            .lean();

        const formatted = stocks.map(s => ({
            ...s,
            product: s.productId,
            productId: s.productId?._id
        }));

        res.status(200).json({
            message: "Stocks retrieved successfully",
            data: formatted
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getStockByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        let stock = await Stock.findOne({ productId })
            .populate("productId", "name price")
            .lean();

        // If no stock found → create it with 0 quantity
        if (!stock) {
            const newStock = await Stock.create({
                productId,
                quantity: 0
            });

            stock = await Stock.findById(newStock._id)
                .populate("productId", "name price")
                .lean();
        }

        res.status(200).json({
            message: "Stock retrieved successfully",
            data: {
                ...stock,
                product: stock.productId,
                productId: stock.productId._id
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updateStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const stock = await Stock.findOne({ productId });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        if (quantity === undefined) {
            return res.status(400).json({ message: "quantity is required" });
        }

        stock.quantity = quantity;
        stock.lastUpdated = Date.now();
        stock.updatedBy = req.user.id;
        stock.updatedByRole = req.user.role;

        await stock.save();

        res.status(200).json({
            message: "Stock updated successfully",
            data: stock
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteStock = async (req, res) => {
    try {
        const { productId } = req.params;

        const stock = await Stock.findOne({ productId });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        await stock.deleteOne();

        res.status(200).json({
            message: "Stock deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

