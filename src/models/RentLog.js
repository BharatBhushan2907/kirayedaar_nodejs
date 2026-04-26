const mongoose = require('mongoose');
const { Schema } = mongoose;

const rentLogSchema = new Schema(
  {
    tenancyId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenancy',
      required: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/, // Format: YYYY-MM
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate rent log for same tenancy + month
rentLogSchema.index({ tenancyId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('RentLog', rentLogSchema);
