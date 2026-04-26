const Joi = require('joi');

const addressSchema = Joi.object({
  houseNumber: Joi.string().required(),
  society: Joi.string().required(),
  locality: Joi.string().required(),
  city: Joi.string().required(),
  pinCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
  state: Joi.string().required(),
});

const addUserDetailsSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  role: Joi.string().valid('LANDLORD', 'TENANT').required(),
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().optional().allow('', null),
  address: addressSchema.required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(60).optional(),
  email: Joi.string().email().optional().allow('', null),
  address: Joi.object({
    houseNumber: Joi.string().optional(),
    society: Joi.string().optional(),
    locality: Joi.string().optional(),
    city: Joi.string().optional(),
    pinCode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
    state: Joi.string().optional(),
  }).optional(),
});

module.exports = { addUserDetailsSchema, updateProfileSchema };
