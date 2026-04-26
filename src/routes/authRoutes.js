const express = require('express');
const { generateOTP, verifyOTP } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { generateOTPSchema, verifyOTPSchema } = require('../validations/authValidation');

const router = express.Router();

router.post('/generate-otp', validate(generateOTPSchema), generateOTP);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);

module.exports = router;
