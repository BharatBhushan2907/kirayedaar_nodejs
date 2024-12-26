const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    rent: { type: Number, required: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
