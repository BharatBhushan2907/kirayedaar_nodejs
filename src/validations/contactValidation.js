const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  subject: Joi.string()
    .valid('tenant', 'landlord', 'verification', 'payment', 'other')
    .required(),
  message: Joi.string().min(10).max(2000).required(),
});

module.exports = { contactSchema };
