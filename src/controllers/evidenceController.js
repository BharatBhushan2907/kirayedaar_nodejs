const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const evidenceService = require('../services/evidenceService');

const uploadEvidence = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const evidence = await evidenceService.uploadEvidence(userId, role, req.body, req.files);
  success(res, evidence, 'Evidence uploaded', 201);
});

const listEvidence = asyncHandler(async (req, res) => {
  const { tenancyId } = req.query;
  const evidence = await evidenceService.listEvidence(tenancyId, req.user.userId);
  success(res, evidence);
});

module.exports = { uploadEvidence, listEvidence };
