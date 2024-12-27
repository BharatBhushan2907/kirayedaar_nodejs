const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema(
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
            required: true,
            match: /^\S+@\S+\.\S+$/,
        },
        tenants: [
            {
                tenant: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tenant",
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
        properties: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Property',
            },
          ],
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

module.exports = mongoose.model("Landlord", landlordSchema);
