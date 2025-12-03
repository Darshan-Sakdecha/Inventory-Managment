import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Purchase = mongoose.model("Purchase", purchaseSchema);