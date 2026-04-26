const Joi = require('joi');

const requestLinkSchema = Joi.object({
  tenantPhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  propertyId: Joi.string().hex().length(24).required(),
  rentAmount: Joi.number().positive().required(),
  depositAmount: Joi.number().min(0).required(),
  startDate: Joi.date().iso().required(),
});

const respondLinkSchema = Joi.object({
  tenancyId: Joi.string().hex().length(24).required(),
  action: Joi.string().valid('approve', 'reject').required(),
});

module.exports = { requestLinkSchema, respondLinkSchema };
