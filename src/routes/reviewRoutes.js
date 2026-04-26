const express = require('express');
const { addReview, listReviews } = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { addReviewSchema } = require('../validations/reviewValidation');
const AppError = require('../utils/AppError');

const router = express.Router();

router.post('/add', authenticate, validate(addReviewSchema), addReview);

router.get('/list', (req, res, next) => {
  if (!req.query.userId) return next(new AppError('userId query param is required', 400));
  next();
}, listReviews);

module.exports = router;
