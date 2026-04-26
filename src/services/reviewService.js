const Review = require('../models/Review');
const Tenancy = require('../models/Tenancy');
const AppError = require('../utils/AppError');

const addReview = async (reviewerId, role, { revieweeId, tenancyId, rating, tags, comment }) => {
  // Tenancy must be ended
  const tenancy = await Tenancy.findOne({
    _id: tenancyId,
    status: 'ended',
    $or: [{ landlordId: reviewerId }, { tenantId: reviewerId }],
  });
  if (!tenancy) throw new AppError('You can only review after a tenancy has ended', 403);

  // Reviewer must be part of this tenancy
  const isLandlord = tenancy.landlordId.toString() === reviewerId.toString();
  const isTenant = tenancy.tenantId.toString() === reviewerId.toString();
  if (!isLandlord && !isTenant) throw new AppError('Access denied', 403);

  // Reviewee must be the other party
  const validReviewee = isLandlord
    ? tenancy.tenantId.toString() === revieweeId
    : tenancy.landlordId.toString() === revieweeId;
  if (!validReviewee) throw new AppError('You can only review your tenant/landlord from this tenancy', 400);

  return Review.create({ reviewerId, reviewerRole: role, revieweeId, tenancyId, rating, tags, comment });
};

const listReviews = async (userId) => {
  return Review.find({ revieweeId: userId })
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = { addReview, listReviews };
