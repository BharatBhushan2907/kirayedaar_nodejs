const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      default: null,
      match: /^\S+@\S+\.\S+$/,
    },
    role: {
      type: String,
      enum: ['TENANT', 'LANDLORD', 'BOTH'],
      required: true,
    },
    city: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Waitlist', waitlistSchema);
