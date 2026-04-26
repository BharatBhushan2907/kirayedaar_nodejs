const Joi = require('joi');

const addReviewSchema = Joi.object({
  revieweeId: Joi.string().hex().length(24).required(),
  tenancyId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  comment: Joi.string().max(500).optional().allow(''),
});

module.exports = { addReviewSchema };
