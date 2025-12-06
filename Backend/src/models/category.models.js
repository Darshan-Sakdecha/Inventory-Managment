import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdByRole: {
        type: String,
        required: true
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedByRole: {
        type: String
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);