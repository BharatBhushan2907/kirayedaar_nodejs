const mongoose = require('mongoose');

const otpRequestSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,   // Store the OTP for verification (optional)
    required: true,
  },
  isExistingUser: {
    type: Boolean,
    default: false, // Default is false, indicating that it's a new user
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '5m',  // The OTP will expire after 5 minutes (optional)
  },
});

const OtpRequest = mongoose.model('OtpRequest', otpRequestSchema);

module.exports = OtpRequest;
