const otpGenerator = require('otp-generator');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const OtpRequest = require('../models/otpRequestModel');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const generateOTP = async (phone) => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const [tenant, landlord] = await Promise.all([
    Tenant.findOne({ phone }),
    Landlord.findOne({ phone }),
  ]);

  const isExistingUser = !!(tenant || landlord);

  // Upsert OTP (one record per phone, TTL handles expiry)
  await OtpRequest.findOneAndUpdate(
    { phone },
    { phone, otp, isExistingUser, createdAt: new Date() },
    { upsert: true, new: true }
  );

  // In production, send via SMS gateway (Twilio, MSG91, etc.)
  logger.info(`[OTP] phone=${phone} otp=${otp} existingUser=${isExistingUser}`);

  return { isExistingUser };
};

const verifyOTP = async (phone, otp) => {
  const otpEntry = await OtpRequest.findOne({ phone, otp });
  if (!otpEntry) throw new AppError('Invalid or expired OTP', 400);

  // Delete OTP after successful verification
  await OtpRequest.deleteMany({ phone });

  const [tenant, landlord] = await Promise.all([
    Tenant.findOne({ phone }),
    Landlord.findOne({ phone }),
  ]);

  const user = tenant || landlord;

  if (!user) {
    // New user — return verified flag, no token yet (register via /user/add-details)
    return { isRegistered: false, phone, token: null };
  }

  const token = signToken({
    userId: user._id.toString(),
    phone: user.phone,
    role: user.role,
  });

  return {
    isRegistered: true,
    phone: user.phone,
    role: user.role,
    name: user.name,
    token,
  };
};

module.exports = { generateOTP, verifyOTP };
