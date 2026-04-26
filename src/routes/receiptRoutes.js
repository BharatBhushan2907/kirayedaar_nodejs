const express = require('express');
const { generateReceipt } = require('../controllers/receiptController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const Joi = require('joi');

const receiptSchema = Joi.object({
  tenancyId: Joi.string().hex().length(24).required(),
  rentLogId: Joi.string().hex().length(24).required(),
});

const router = express.Router();

router.post('/generate', authenticate, validate(receiptSchema), generateReceipt);

module.exports = router;
