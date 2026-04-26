const express = require('express');
const { requestLink, respondLink, listTenancies, endTenancy } = require('../controllers/tenancyController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { requestLinkSchema, respondLinkSchema } = require('../validations/tenancyValidation');

const router = express.Router();

router.use(authenticate);

// Landlord initiates the tenancy
router.post('/request-link', authorize('LANDLORD'), validate(requestLinkSchema), requestLink);

// Tenant approves or rejects
router.post('/respond-link', authorize('TENANT'), validate(respondLinkSchema), respondLink);

// Both can list
router.get('/list', listTenancies);

// Both can end (landlord or tenant can initiate)
router.post('/end', endTenancy);

module.exports = router;
