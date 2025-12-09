import { Product } from "../../models/product.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from 'fs';

export const createProduct = async (req, res) => {
    try {
        const { name, categoryId, supplierId, sku, price, quantity, description } = req.body;

        const createdBy = req.user.id;
        const createdByRole = req.user.role;

        if (!name || !categoryId || !supplierId || !sku || !price || !quantity) {
            return res.status(400).json({ message: "All required fields must be provided." })
        }

        const existSku = await Product.findOne({ sku });
        if (existSku) {
            return res.status(409).json({ message: "SKU already exist" });
        }

        console.log("File path : ", req.file.path);

        let imageUrl = "";
        if (req.file) {
            const upload = await uploadOnCloudinary(req.file.path);

            if (!upload) {
                return res.status(500).json({
                    message: "Image upload failed"
                });
            }


            imageUrl = upload.secure_url;
        }

        const newProduct = await Product.create({
            name,
            categoryId,
            supplierId,
            sku,
            price,
            quantity,
            description,
            image: imageUrl,
            createdBy,
            createdByRole
        });

        res.status(201).json({
            message: "Product created successfully",
            newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const getProducts = async (req, res) => {
    try {
        //populate() in Mongoose is used to replace a referenced ObjectId with the actual document it refers to.
        const products = await Product.find({})
            .populate("categoryId", "name")
            .populate("supplierId", "name")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole");

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found"
            });
        }

        res.status(200).json({
            message: "Products retrieved successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Product Id is required"
            });
        }

        const product = await Product.findById(id)
            .populate("categoryId", "name")
            .populate("supplierId", "name")
            .select("-createdBy -createdByRole -updatedBy -updatedByRole");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product is find successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId, supplierId, sku, price, quantity, description } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Product Id is required for Update"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        // Update fields if provided
        if (name) product.name = name;
        if (categoryId) product.categoryId = categoryId;
        if (supplierId) product.supplierId = supplierId;
        if (sku) product.sku = sku;
        if (price) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;
        if (description) product.description = description;

        // Update role info
        product.updatedBy = req.user.id;
        product.updatedByRole = req.user.role;

        // Handle new image upload
        if (req.file) {
            const upload = await uploadOnCloudinary(req.file.path);
            if (!upload) {
                return res.status(500).json({
                    message: "Image upload failed"
                });
            }
            product.image = upload.secure_url;

            // Remove local temp file
            fs.unlinkSync(req.file.path);
        }
        // Save updated product
        await product.save();

        // Return updated product (exclude sensitive fields)
        const updatedProduct = await Product.findById(id)
            .populate("categoryId", "name")
            .populate("supplierId", "name")
            .select("-createdBy -createByRole -updatedBy -updatedByRole");

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Product Id is required for delete a product"
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}