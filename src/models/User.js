const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            match: /^[0-9]{10}$/, // Ensure a valid 10-digit phone number
        },
        name: {
            type: String,
            default: null, // Name is optional during initial OTP-based login
        },
        email: {
            type: String,
            default: null,
            match: /^\S+@\S+\.\S+$/, // Optional, but must be valid if provided
        },
        role: {
            type: String,
            enum: ["tenant", "landlord"], // User roles in the system
            default: "landlord",
        },
        address: {
            houseNumber: {
                type: String,
                default: null,
            },
            society: {
                type: String,
                default: null,
            },
            locality: {
                type: String,
                default: null,
            },
            city: {
                type: String,
                default: null,
            },
            pinCode: {
                type: String,
                match: /^[0-9]{6}$/, // Ensure a valid 6-digit pin code
                default: null,
            },
            state: {
                type: String,
                default: null,
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically manages `createdAt` and `updatedAt`
    }
);

// Middleware to update `updatedAt` before save
userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);