const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    subject: {
      type: String,
      required: true,
      enum: ['tenant', 'landlord', 'verification', 'payment', 'other'],
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
