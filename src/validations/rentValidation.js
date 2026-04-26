const Joi = require('joi');

const addRentLogSchema = Joi.object({
  tenancyId: Joi.string().hex().length(24).required(),
  month: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({ 'string.pattern.base': 'Month must be in YYYY-MM format' }),
  amount: Joi.number().positive().required(),
});

const markPaidSchema = Joi.object({
  rentLogId: Joi.string().hex().length(24).required(),
});

module.exports = { addRentLogSchema, markPaidSchema };
