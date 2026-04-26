const mongoose = require('mongoose');
const { Schema } = mongoose;

const tenancySchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'Landlord',
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'ended', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Only one active tenancy per property at a time
tenancySchema.index({ propertyId: 1, status: 1 });

module.exports = mongoose.model('Tenancy', tenancySchema);
