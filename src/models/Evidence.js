const mongoose = require('mongoose');
const { Schema } = mongoose;

const evidenceSchema = new Schema(
  {
    tenancyId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenancy',
      required: true,
    },
    type: {
      type: String,
      enum: ['move-in', 'move-out'],
      required: true,
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    uploadedByRole: {
      type: String,
      enum: ['TENANT', 'LANDLORD'],
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Evidence', evidenceSchema);
