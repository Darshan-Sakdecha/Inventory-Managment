import { Category } from "../../models/category.models.js";

// Admin & manager by Create category 
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name) {
            return res.status(400).json({
                message: "Enter proper data"
            });
        }
        // check already category name data is not store in db ! 
        const existingName = await Category.findOne({ name });
        if (existingName) {
            return res.status(400).json({
                message: "Category already exist"
            });
        }
        // create category
        const category = await Category.create({
            name,
            description,
            createdBy: req.user.id,
            createdByRole: req.user.role
        });
        //  console.log(`${req.user.role} (${req.user.email}) created category: ${name}`);

        res.status(201).json({
            message: "Category create successfully",
            category
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

// admin , manager , staff by get
export const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find({})
            .select("-createdBy -createdByRole -updatedBy -updatedByRole");

        res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

// admin , manager , staff by get
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Category ID is required"
            });
        }
        const category = await Category.findById(id).select("-createdBy -createdByRole -updatedBy -updatedByRole");

        // If not found
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// Admin & manager by update
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Category Id is required"
            });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json("Category not found");
        }

        if (name) {
            category.name = name;
        }
        if (description) {
            category.description = description;
        }

        category.updatedBy = req.user.id;
        category.updatedByRole = req.user.role;

        await category.save();

        const updateCategory = await Category.findById(id).select("-createdBy -createdByRole -updatedBy -updatedByRole");

        res.status(200).json({
            message: "category updated successfully",
            category: updateCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

// Admin only by delete
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Category Id is required"
            });
        }

        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            message: "Category deleted successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}