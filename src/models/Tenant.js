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
            required: false,
        },
        email: {
            type: String,
            default: null,
            match: /^\S+@\S+\.\S+$/,
        },
        landlords: [
            {
                landlord: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Landlord",
                },
                property: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Property",
                },
                isActive: {
                    type: Boolean,
                    default: true,
                },
                startDate: {
                    type: Date,
                    default: Date.now,
                },
                endDate: {
                    type: Date,
                    default: null, // Null means tenancy is still active
                },
            },
        ],
        isApproved: {
            type: Boolean,
            default: false,
        },
        address: {
            houseNumber: { type: String, required: false },
            society: { type: String, required: false },
            locality: { type: String, required: false },
            city: { type: String, required: false },
            pinCode: { type: String, match: /^[0-9]{6}$/, required: false },
            state: { type: String, required: false },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
