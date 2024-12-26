const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            match: /^[0-9]{10}$/,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: null,
            match: /^\S+@\S+\.\S+$/,
        },
        landlord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Landlord",
            default: null,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        address: {
            houseNumber: { type: String, required: true },
            society: { type: String, required: true },
            locality: { type: String, required: true },
            city: { type: String, required: true },
            pinCode: { type: String, match: /^[0-9]{6}$/, required: true },
            state: { type: String, required: true },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
