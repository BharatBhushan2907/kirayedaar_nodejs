const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Landlord',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    houseNumber: { type: String, required: true },
    society: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
  },
  roomDetails: {
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    balconies: { type: Number, required: false },
    otherRooms: { type: [String], default: [] }, // Array to store other room types
    parkingAvailable: { type: Boolean, default: false },
  },
  areaDetails: {
    carpetArea: { type: Number, required: true }, // in sq. ft or sq. meters
    builtUpArea: { type: Number, required: false },
    superBuiltUpArea: { type: Number, required: false },
  },
  floorDetails: {
    totalFloors: { type: Number, required: true },
    propertyOnFloor: { type: Number, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Property', propertySchema);
