const Joi = require('joi');

const waitlistSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required()
    .messages({ 'string.pattern.base': 'Phone must be a 10-digit number' }),
  email: Joi.string().email().optional().allow('', null),
  role: Joi.string().valid('TENANT', 'LANDLORD', 'BOTH').required(),
  city: Joi.string().optional().allow('', null),
});

module.exports = { waitlistSchema };
