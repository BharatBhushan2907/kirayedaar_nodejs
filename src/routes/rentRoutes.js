const express = require('express');
const { addRentLog, listRentLogs, markPaid } = require('../controllers/rentController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { addRentLogSchema, markPaidSchema } = require('../validations/rentValidation');
const AppError = require('../utils/AppError');

const router = express.Router();

router.use(authenticate);

router.post('/add', authorize('LANDLORD'), validate(addRentLogSchema), addRentLog);

router.get('/list', (req, res, next) => {
  if (!req.query.tenancyId) return next(new AppError('tenancyId query param is required', 400));
  next();
}, listRentLogs);

router.post('/mark-paid', authorize('LANDLORD'), validate(markPaidSchema), markPaid);

module.exports = router;
