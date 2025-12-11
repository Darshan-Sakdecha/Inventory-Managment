import { Sale } from "../../models/sale.models.js";
import { Product } from "../../models/product.models.js";

export const createSale = async (req, res) => {
    try {
        const { productId, quantity, salePrice } = req.body;

        const createdBy = req.user.id;
        const createdByRole = req.user.role;

        if (!productId || !quantity || !salePrice) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const totalAmount = quantity * salePrice;

        const newSale = await Sale.create({
            productId,
            quantity,
            salePrice,
            totalAmount,
            createdBy,
            createdByRole
        });

        res.status(201).json({
            message: "Sale created successfully",
            sale: newSale
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getSales = async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Server error"
        });
    }
}