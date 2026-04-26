const express = require('express');
const { joinWaitlist } = require('../controllers/waitlistController');
const validate = require('../middlewares/validate');
const { waitlistSchema } = require('../validations/waitlistValidation');

const router = express.Router();

router.post('/', validate(waitlistSchema), joinWaitlist);

module.exports = router;
