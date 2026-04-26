const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ['TENANT', 'LANDLORD'],
      required: true,
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    tenancyId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenancy',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
    comment: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// One review per reviewer per tenancy
reviewSchema.index({ reviewerId: 1, tenancyId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
