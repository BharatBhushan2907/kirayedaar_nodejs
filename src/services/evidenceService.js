const path = require('path');
const Evidence = require('../models/Evidence');
const Tenancy = require('../models/Tenancy');
const AppError = require('../utils/AppError');

const _assertAccess = async (tenancyId, userId) => {
  const tenancy = await Tenancy.findOne({
    _id: tenancyId,
    $or: [{ landlordId: userId }, { tenantId: userId }],
    status: { $in: ['active', 'ended'] },
  });
  if (!tenancy) throw new AppError('Tenancy not found or access denied', 404);
  return tenancy;
};

const uploadEvidence = async (userId, role, { tenancyId, type, notes }, files) => {
  await _assertAccess(tenancyId, userId);

  if (!files || files.length === 0) throw new AppError('At least one file is required', 400);

  // Build URLs relative to /uploads — replace with S3 URLs in production
  const mediaUrls = files.map((f) => `/uploads/${f.filename}`);

  return Evidence.create({
    tenancyId,
    type,
    mediaUrls,
    uploadedBy: userId,
    uploadedByRole: role,
    notes: notes || '',
  });
};

const listEvidence = async (tenancyId, userId) => {
  await _assertAccess(tenancyId, userId);
  return Evidence.find({ tenancyId }).sort({ timestamp: -1 }).lean();
};

module.exports = { uploadEvidence, listEvidence };
