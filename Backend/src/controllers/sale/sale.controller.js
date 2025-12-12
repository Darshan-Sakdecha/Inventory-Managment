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

export const getSales = async (req, res) => {
    try {
        let sales = await Sale.find({})
            .populate("productId", "name price")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean(); // return simple plain javascript object 

        if (!sales || sales.length === 0) {
            return res.status(404).json({
                message: "No sales found"
            });
        }

        //Rename productId -> product
        sales = sales.map(s => ({
            ...s,
            product: s.productId,
            productId: s.productId._id
        }));

        res.status(200).json({
            message: "Sales retrived successfully",
            sales
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Sale Id is required"
            });
        }

        let sale = await Sale.findById(id)
            .populate("productId", "name price")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean();

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        sale = {
            ...sale,
            product: sale.productId,
            productId: sale.productId._id
        };

        res.status(200).json({
            message: "Sale retrived successfully",
            sale
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, quantity, salePrice } = req.body;

        const updatedBy = req.user.id;
        const updatedByRole = req.user.role;

        if (!id) {
            return res.status(400).json({
                message: "Sale Id is required for updating"
            });
        }

        let sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        //Update product if provided
        if (productId) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            sale.productId = productId;
        }

        if (quantity) {
            sale.quantity = quantity;
        }
        if (salePrice) {
            sale.salePrice = salePrice;
        }

        //Recalculate totalAmount : 
        if (quantity || salePrice) {
            sale.totalAmount = sale.quantity * sale.salePrice;
        }

        sale.updatedBy = updatedBy;
        sale.updatedByRole = updatedByRole;

        await sale.save();

        sale = await Sale.findById(id)
            .populate("productId", "name price")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean();

        sale = {
            ...sale,
            product: sale.productId,
            productId: sale.productId._id
        };

        res.status(200).json({
            message: "Sale updated successfully",
            sale
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Sale Id is required"
            });
        }

        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        await Sale.findByIdAndDelete(id);

        res.status(200).json({
            message: "Sale deleted successfully",
            sale
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}