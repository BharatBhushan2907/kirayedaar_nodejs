const Joi = require('joi');

const phone = Joi.string()
  .pattern(/^[0-9]{10}$/)
  .required()
  .messages({ 'string.pattern.base': 'Phone must be a 10-digit number' });

const generateOTPSchema = Joi.object({ phone });

const verifyOTPSchema = Joi.object({
  phone,
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({ 'string.pattern.base': 'OTP must be 4 digits' }),
});

module.exports = { generateOTPSchema, verifyOTPSchema };
