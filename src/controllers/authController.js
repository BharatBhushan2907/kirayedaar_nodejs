const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const authService = require('../services/authService');

const generateOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const result = await authService.generateOTP(phone);
  success(res, result, 'OTP sent successfully');
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const result = await authService.verifyOTP(phone, otp);

  if (!result.isRegistered) {
    return success(res, { phone: result.phone, isRegistered: false }, 'OTP verified. Please complete registration.');
  }

  success(res, result, 'Login successful');
});

module.exports = { generateOTP, verifyOTP };
