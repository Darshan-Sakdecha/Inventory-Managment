import { Supplier } from "../../models/supplier.models.js";

// Admin & manager by create 
export const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address, company } = req.body

        if (!name) {
            return res.status(400).json({
                message: "Supplier name is required"
            });
        }
        //create supplier
        const supplier = await Supplier.create({
            name,
            email,
            phone,
            address,
            company,
            createdBy: req.user.id,
            createdByRole: req.user.role
        });

        res.status(201).json({
            message: "Supplier created successfully",
            supplier
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// Admin , manager , staff by get
export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).select("-createdBy -createdByRole -updatedBy -updatedByRole");

        if (suppliers.length === 0) {
            return res.status(404).json({
                message: "No suppliers found"
            });
        }

        res.status(200).json({ suppliers });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// Admin , manager , staff by get
export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Supplier Id is required"
            });
        }

        const supplier = await Supplier.findById(id).select("-createdBy -createdByRole -updatedBy -updatedByRole");
        if (!supplier) {
            return res.status(404).json({
                message: "Supplier is not found"
            });
        }

        res.status(200).json({
            message: "Supplier is found",
            supplier
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// Admin , manager by update
export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, phone, address, company } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Supplier Id is required for update"
            });
        }

        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        if (name) supplier.name = name;
        if (email) supplier.email = email;
        if (phone) supplier.phone = phone;
        if (address) supplier.address = address;
        if (company) supplier.company = company;
        supplier.updatedBy = req.user.id;
        supplier.updatedByRole = req.user.role;

        await supplier.save();

        const updatedSupplier = await Supplier.findById(id).select("-createdBy -createdByRole -updatedBy -updatedByRole");

        res.status(200).json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// Admin by delete
export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Supplier Id is Required"
            });
        }

        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({
                message: "Supplier not found"
            });
        }

        await Supplier.findByIdAndDelete(id);

        res.status(200).json({
            message: "Supplier is removed successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}