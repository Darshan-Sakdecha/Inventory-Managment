import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    company: {
        type: String
    }
}, { timestamps: true });

export const Supplier = mongoose.model("Supplier", supplierSchema);