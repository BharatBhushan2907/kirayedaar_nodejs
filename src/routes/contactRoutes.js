const express = require('express');
const { submitContact } = require('../controllers/contactController');
const validate = require('../middlewares/validate');
const { contactSchema } = require('../validations/contactValidation');

const router = express.Router();

router.post('/', validate(contactSchema), submitContact);

module.exports = router;
