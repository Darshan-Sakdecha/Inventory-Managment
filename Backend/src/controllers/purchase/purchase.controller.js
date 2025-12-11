import { Purchase } from "../../models/purchase.models.js";
import { Product } from "../../models/product.models.js";
import { Supplier } from "../../models/supplier.models.js";

export const createPurchase = async (req, res) => {
    try {
        const { productId, supplierId, quantity, purchasePrice } = req.body;
        const createdBy = req.user.id;
        const createdByRole = req.user.role;

        if (!productId || !supplierId || !quantity || !purchasePrice) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check product exist :
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check supplier exist : 
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        //Calculate total amount :
        const totalAmount = quantity * purchasePrice;

        const newPurchase = await Purchase.create({
            productId,
            supplierId,
            quantity,
            purchasePrice,
            totalAmount,
            createdBy,
            createdByRole
        });

        res.status(201).json({
            message: "Purchase created successfully",
            purchase: newPurchase
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getPurchases = async (req, res) => {
    try {
        let purchases = await Purchase.find({})
            .populate("productId", "name price")
            .populate("supplierId", "name phone")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean();  // convert to plain JS objects

        if (!purchases || purchases.length === 0) {
            return res.status(404).json({
                message: "Purchased items are not found"
            });
        }

        // Rename productId → product, supplierId → supplier
        purchases = purchases.map(p => ({
            ...p,
            product: p.productId,
            supplier: p.supplierId,
            productId: p.productId._id,
            supplierId: p.supplierId._id
        }));

        res.status(200).json({
            message: "Purchases are:",
            purchases
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
                message: "Purchase Id is required"
            });
        }

        let purchase = await Purchase.findById(id)
            .populate("productId", "name price")
            .populate("supplierId", "name phone")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean();

        if (!purchase) {
            return res.status(404).json({
                message: "Purchase is not found"
            });
        }

        // Rename productId → product, supplierId → supplier
        purchase = {
            ...purchase,
            product: purchase.productId,
            supplier: purchase.supplierId,
            productId: purchase.productId._id,
            supplierId: purchase.supplierId._id
        };

        res.status(200).json({
            message: "Purchase is : ",
            purchase
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updatePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId, supplierId, quantity, purchasePrice } = req.body;

        const updatedBy = req.user.id;
        const updatedByRole = req.user.role;
        if (!id) {
            return res.status(400).json({
                message: "Purchase Id is required for update"
            });
        }

        let purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        // Send productId ? If productId provided, check if valid
        if (productId) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            purchase.productId = productId;
        }

        // Send supplierId ? If supplierId provided, check if valid
        if (supplierId) {
            const supplier = await Supplier.findById(supplierId);
            if (!supplier) {
                return res.status(404).json({
                    message: "Supplier not found"
                });
            }
            purchase.supplierId = supplierId;
        }

        if (quantity) purchase.quantity = quantity;
        if (purchasePrice) purchase.purchasePrice = purchasePrice;

        // Recalculate totalAmount if quantity or purchasePrice changed
        if (quantity || purchasePrice) {
            purchase.totalAmount = purchase.quantity * purchase.purchasePrice;
        }
        purchase.updatedBy = updatedBy;
        purchase.updatedByRole = updatedByRole;

        await purchase.save();

        // Populate fields for response
        purchase = await Purchase.findById(id)
            .populate("productId", "name price")
            .populate("supplierId", "name phone")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole")
            .lean();

        // Rename productId → product, supplierId → supplier
        purchase = {
            ...purchase,
            product: purchase.productId,
            supplier: purchase.supplierId,
            productId: purchase.productId._id,
            supplierId: purchase.supplierId._id
        };

        res.status(200).json({
            message: "Purchase updated successfully",
            purchase
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Purchase Id is required for delete"
            });
        }

        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        await Purchase.findByIdAndDelete(id);

        res.status(200).json({
            message: "Purchase deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}