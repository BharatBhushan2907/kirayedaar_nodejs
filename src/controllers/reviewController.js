const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const reviewService = require('../services/reviewService');

const addReview = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const review = await reviewService.addReview(userId, role, req.body);
  success(res, review, 'Review submitted', 201);
});

const listReviews = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const reviews = await reviewService.listReviews(userId);
  success(res, reviews);
});

module.exports = { addReview, listReviews };
