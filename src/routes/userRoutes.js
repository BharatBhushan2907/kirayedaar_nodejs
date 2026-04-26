const express = require('express');
const { addUserDetails, getProfile, updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { addUserDetailsSchema, updateProfileSchema } = require('../validations/userValidation');

const router = express.Router();

// Public — called after OTP verification to complete registration
router.post('/add-details', validate(addUserDetailsSchema), addUserDetails);

// Protected
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

module.exports = router;
